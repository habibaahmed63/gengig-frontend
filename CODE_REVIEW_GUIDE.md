# Gengig Frontend — Complete Code Review Guide

> Discussion prep for Sunday. Covers every layer: state, APIs, Supabase, real-time, routing, responsiveness, and common interview questions.

---

## 1. Tech Stack at a Glance

| Layer | Tool | Why |
|---|---|---|
| Framework | React 18 (with Vite) | Fast HMR, component model |
| Routing | React Router v6 | Declarative client-side routing |
| Styling | Tailwind CSS v4 | Utility-first, no custom CSS needed |
| HTTP | Axios (via `api.js`) | Centralized instance with interceptors |
| Real-time | Socket.io client | Live notifications and chat |
| Auth (OAuth) | Supabase JS client | Google sign-in flow |
| Deployment | Vercel | Frontend + backend both on Vercel |

---

## 2. Project Structure

```
src/
 ├── main.jsx            ← Entry point, renders <App>
 ├── App.jsx             ← Root: splash screen + socket room join
 ├── index.css           ← Global styles, Tailwind import, body bg
 ├── routes/
 │   └── AppRouter.jsx   ← All route definitions + PrivateRoute guard
 ├── services/
 │   ├── api.js          ← Axios instance (all backend calls)
 │   ├── supabase.js     ← Supabase client (Google OAuth)
 │   └── socket.js       ← Socket.io client (real-time)
 ├── layouts/
 │   ├── AgentLayout.jsx      ← Sidebar + Navbar wrapper for agents
 │   └── TeenlancerLayout.jsx ← Same for teenlancers
 ├── components/
 │   ├── Navbar.jsx       ← Top nav bar, mobile menu, notifications
 │   ├── GengigChatbot.jsx← Floating AI chat widget
 │   ├── SplashScreen.jsx ← Initial loading animation
 │   ├── Toast.jsx        ← Notification toast messages
 │   ├── RoleGuard.jsx    ← Modal shown when wrong role tries an action
 │   ├── PremiumButton.jsx← Premium subscription CTA
 │   └── Breadcrumb.jsx   ← Navigation breadcrumbs
 ├── hooks/
 │   ├── useRoleGuard.js  ← Hook to check user role + show guard
 │   └── Toast.js         ← Toast helper hook
 ├── pages/
 │   ├── Home.jsx, Exploreagig.jsx, GigDetails.jsx, etc.
 │   ├── auth/            ← GoogleSuccess.jsx, AuthCallback.jsx
 │   ├── onboarding/      ← AgentOnboarding.jsx, TeenlancerOnboarding.jsx
 │   ├── agent/           ← Dashboard, Applications, MyGigs, Profile, etc.
 │   └── teenlancer/      ← Dashboard, Profile, Community, Chat, etc.
```

---

## 3. Entry Point — `main.jsx` and `App.jsx`

### `main.jsx`
```jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```
- React's strict mode runs effects twice in development to catch bugs.
- The `root` div is in `index.html`.

### `App.jsx`
```jsx
const [showSplash, setShowSplash] = useState(true);
```
- **State**: `showSplash` — controls whether the splash screen shows before the app loads.
- On mount, it reads `userId` from `localStorage` and emits a `"join"` event to the socket so the user joins their real-time room immediately.
- Listens for `socket.on("connect", ...)` to re-join on reconnection.
- Listens for `window.addEventListener("storage", ...)` to join the room when a user logs in (the login page sets `userId` in localStorage and triggers a storage event).

---

## 4. Environment Variables (`.env`)

```
VITE_SUPABASE_URL=https://...supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_API_URL=https://gengig-backend.vercel.app/
```

- Vite exposes env vars as `import.meta.env.VITE_*` at build time.
- These are **embedded into the bundle** at build — not runtime. Changing them requires a new build/deploy.
- In Vercel, you must add these same variables in the project's Environment Variables settings.

---

## 5. Services Layer

### `api.js` — The Axios Instance
```js
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    headers: { "Content-Type": "application/json" },
});
```

**Request Interceptor** (runs before every request):
- Reads the JWT token from `localStorage`.
- Adds `Authorization: Bearer <token>` header automatically to every call.
- This means you never manually add the auth header — it's automatic.

**Response Interceptor** (runs after every response):
- If the backend returns **401 Unauthorized**, it clears the token and role from `localStorage` and redirects to `/signin`.
- This handles expired/invalid tokens globally — no need to handle 401 in every component.

**How it's used:**
```js
import api from "../../services/api";

// GET
const res = await api.get("/agent/gigs");

// POST
const res = await api.post("/auth/login", { email, password });

// PUT
await api.put(`/agent/applications/${id}/accept`);
```

---

### `supabase.js` — The Supabase Client

```js
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

- Used for **Google OAuth** sign-in.
- The anon key is safe to be public — it only allows unauthenticated operations (like initiating OAuth).
- **Used in `LogIn.jsx`**:
  ```js
  await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  ```
  After Google authenticates, the user is redirected to `/auth/callback`, where `GoogleSuccess.jsx` picks up the session and calls our backend to finalize login.

---

### `socket.js` — Socket.io Client

```js
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

const socket = io(BASE_URL, {
  transports: ['polling', 'websocket'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
});
```

**Key decisions:**
- The socket is created **once, outside any component** — it's a singleton. This prevents creating multiple connections on re-renders.
- `transports: ['polling', 'websocket']` — starts with HTTP long-polling (always works), then upgrades to WebSocket if possible.
- On connect/reconnect, it emits `"join"` with the userId to join the user's personal room on the server, so targeted notifications work.

**Events listened to in Navbar:**
- `socket.on("new_notification", ...)` → increments the badge counter.

**Events listened to in `App.jsx`:**
- `socket.on("connect", ...)` → re-joins the room after reconnection.

---

## 6. Routing — `AppRouter.jsx`

Uses **React Router v6** with the `<BrowserRouter>` + `<Routes>` + `<Route>` pattern.

### Route Categories

| Type | Example | Protected? |
|---|---|---|
| Public | `/home`, `/Exploreagig`, `/gig/:id` | No |
| Auth | `/signin`, `/signup`, `/forgot-password` | No |
| Onboarding | `/onboarding/teenlancer` | Yes (login required) |
| Teenlancer | `/teenlancer/dashboard` | Yes (login required) |
| Agent | `/agent/dashboard` | Yes (login required) |

### `PrivateRoute` Component
```jsx
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? children : <Navigate to="/signin" replace />;
}
```
- Wraps protected routes.
- Checks both `localStorage` (remember me = true) and `sessionStorage` (remember me = false).
- Uses `<Navigate replace>` so the back button doesn't take you to a protected page you don't have access to.
- **Note**: There's no role-based routing here — an agent could technically visit `/teenlancer/dashboard` if they're logged in. The role check happens inside individual pages using `useRoleGuard`.

### Dynamic Routes
- `/gig/:id` — `useParams()` extracts `id`
- `/agent/review-revision/:applicationId` — same pattern
- `/teenlancer/submitwork/:applicationId` — same
- `/profile/:slug` — public profile by slug

---

## 7. Authentication Flow

### Email/Password Login (`LogIn.jsx`)

**States:**
- `formData` — `{ email, password, rememberMe }`
- `loading` — shows "Logging in..." on button
- `error` — displays error message under form
- `showPassword` — toggles password visibility

**Flow:**
1. User submits form → `handleSubmit()` fires
2. `api.post("/auth/login", { email, password })` called
3. On success, the response `d` contains: `token`, `role`, `name`, `photo`, `_id`, `slug`, and role-specific fields
4. If `rememberMe` → token saved to `localStorage`; otherwise → `sessionStorage`
5. All user data keys are saved to `localStorage` for immediate access across components
6. `window.dispatchEvent(new Event("storage"))` fires to notify Navbar/layouts to update their displayed name/photo
7. Socket `"join"` event emitted with userId
8. Navigate to role-specific dashboard: `/agent/dashboard` or `/teenlancer/dashboard`

**Error handling:**
- 429 status → "Too many login attempts" message
- Other errors → backend message or generic fallback

### Email/Password Registration (`SignUp.jsx`)

**States:** Same pattern — `formData`, `loading`, `error`

**Flow:**
1. `api.post("/auth/register", { name, email, password, role })`
2. If response has a `token` → auto-login, navigate to profile
3. If no `token` → email verification required → navigate to `/verify-email`

### Google OAuth
1. **Login**: `supabase.auth.signInWithOAuth({ provider: "google" })` → Supabase redirects to Google → Google redirects to `/auth/callback`
2. **SignUp**: `window.location.href = ${BASE_URL}/auth/google` → backend handles OAuth
3. `GoogleSuccess.jsx` reads the auth parameters from the URL and finalizes login

---

## 8. State Management Philosophy

**There is no global state library** (no Redux, no Zustand, no Context API used broadly). Instead:

| Data | Where it lives | Why |
|---|---|---|
| Auth token, role | `localStorage` / `sessionStorage` | Persists across refreshes |
| User profile (name, photo, etc.) | `localStorage` | Quick access without API calls |
| UI state (loading, open/close, filter) | `useState` per component | Local, doesn't need to be shared |
| Server data (gigs, applications) | `useState` per page, fetched on mount | Always fresh from API |

**How components share user data:**
- They all read from `localStorage` directly
- When the profile updates, `window.dispatchEvent(new Event("storage"))` fires
- Components listen with `window.addEventListener("storage", ...)` and re-read from localStorage

---

## 9. Layouts

Both `AgentLayout` and `TeenlancerLayout` follow the same pattern:

**States:**
- `sidebarOpen` — controls mobile drawer visibility (default: `false`)
- `collapsed` — controls desktop sidebar collapse (default: `false`)
- `name`, `photo` — read from `localStorage`, updated on `storage` event

**Structure:**
```
<div min-h-screen bg-#060834>
  <Navbar />                        ← Always at top
  <div flex relative>
    [Mobile hamburger button]       ← Fixed, bottom-right, lg:hidden
    [Mobile overlay]               ← Fixed, semi-transparent backdrop
    [Mobile drawer sidebar]        ← Fixed, slides from left, lg:hidden
    <aside hidden lg:flex>         ← Desktop sidebar, collapsible
    <main flex-1>
      {children}                   ← Page content goes here
    </main>
    <GengigChatbot />              ← Floating widget, fixed position
  </div>
</div>
```

**Collapse behavior (desktop):**
- `collapsed` state toggles sidebar width between `208px` and `64px`
- When collapsed, nav labels are hidden (`!isCollapsed && <span>`)
- Icons always show
- The `SidebarContent` sub-component receives `isCollapsed` prop

**Mobile behavior:**
- Sidebar is a fixed drawer that slides in/out via CSS `transform: translateX()`
- Opens when hamburger button clicked (`setSidebarOpen(true)`)
- Closes when: overlay clicked, close button clicked, or any nav link clicked (`onClick={() => setSidebarOpen(false)}`)

---

## 10. Agent Pages

### `agent/Dashboard.jsx`

**States:**
- `allGigs` — all gigs posted by agent
- `stats` — `{ teenlancersHired, totalSpent, completedGigs, avgPerGig }`
- `recentApplications` — 3 most recent applications
- `loading` — controls skeleton / spinner display

**Data fetching:**
```js
const [gigsRes, statsRes, appsRes] = await Promise.all([
  api.get("/agent/gigs"),
  api.get("/agent/stats"),
  api.get("/agent/applications?limit=3"),
]);
```
Uses `Promise.all()` — all 3 API calls fire simultaneously, not one after another. This is faster.

**Computed values (derived from state, no extra state needed):**
```js
const openGigs = allGigs.filter(g => g.status === "open" || g.status === "Open");
const activeGigs = allGigs.filter(g => g.status === "active" || g.status === "Active");
const completedGigs = allGigs.filter(g => g.status === "completed" || ...);
```

**`GigRow` sub-component**: Defined inside the page component. Takes `gig`, `statusLabel`, `statusColor`, `statusBg`, `last` as props. Renders a single gig row in the list.

**Conditional rendering logic:**
- `loading` → skeleton cards + spinner
- `!hasActivity` → empty state with tips
- `hasActivity` → actual dashboard content

### `agent/Applications.jsx`

**States:**
- `applications` — all applications fetched
- `loading` — initial data load
- `actionLoading` — tracks which specific accept/reject button is loading (e.g., `"appId_accept"`)
- `filter` — status filter: `"all"` | `"pending"` | `"accepted"` | `"rejected"`
- `gigFilter` — filter by specific gig
- `expandedApp` — which application row is expanded
- `toast` — `{ message, type }` for success/error messages

**Actions:**
- `handleAccept(id, name)` → `api.put("/agent/applications/${id}/accept")`
- `handleReject(id, name)` → `api.put("/agent/applications/${id}/reject")`
- Both update state **optimistically** after success (no re-fetch)

### `agent/ReviewWork.jsx` + `agent/ReviewRevision.jsx`

After a teenlancer submits work, the agent can:
1. **Approve** → marks gig complete, releases payment
2. **Request revision** → sends feedback to teenlancer with a reason

`ReviewRevision.jsx` is the same flow but the agent sees the revised submission.

### `agent/MyGigs.jsx`, `agent/Profile.jsx`, `agent/Chat.jsx`, `agent/Settings.jsx`, `agent/PaymentDetails.jsx`

All follow the same pattern: `useEffect` on mount → `api.get(...)` → store in state → render.

---

## 11. Teenlancer Pages

### `teenlancer/Dashboard.jsx`

**States:**
- `myApplications` — all applications by the teenlancer
- `stats` — `{ totalEarnings, completedGigs, avgPerGig, rating }`
- `loading`
- `activeTab` — `"overview"` | `"applications"` | `"revisions"` | `"active"` | `"completed"`

**Computed values:**
```js
const acceptedApps = myApplications.filter(a => a.status === "accepted");
const pendingApps = myApplications.filter(a => a.status === "pending");
const rejectedApps = myApplications.filter(a => a.status === "rejected");
const completedApps = myApplications.filter(a => a.status === "completed");
const revisionApps = myApplications.filter(a =>
  a.status === "revision_requested" || a.status === "revision" || a.workRejected === true
);
```

**URL-driven tab:**
```js
const [searchParams] = useSearchParams();
useEffect(() => {
  if (searchParams.get("tab") === "revisions") setActiveTab("revisions");
}, [searchParams]);
```
If the user navigates to `/teenlancer/dashboard?tab=revisions`, the revisions tab opens automatically.

**`AppCard` sub-component**: Shows a single application with status badge and action buttons:
- Accepted → "Chat" button (navigates to chat with agent pre-selected) + "Submit Work" button
- Rejected → "Find More" button (navigates to Explore)
- Revision requested → "Submit Revision" button (navigates to submit work with `?revision=true&reason=...`)

### `teenlancer/Community.jsx`
Community hub where teenlancers interact with each other.

### `teenlancer/Chat.jsx` + `agent/Chat.jsx`
Real-time messaging between agents and teenlancers. Uses socket events for live messages.

### `teenlancer/SubmitWork.jsx`
Used to submit work files/links for an accepted gig. Also handles revision submissions (URL param `?revision=true`).

---

## 12. Public Pages

### `Home.jsx`
Landing page — hero section, features, how it works, call to action.

### `Exploreagig.jsx`
Browse all open gigs. Filters by category, search by keyword. Uses `api.get("/gigs")`.

### `GigDetails.jsx`
Single gig view. Dynamic route `/gig/:id`. Teenlancers can apply from here.

### `ApplyGig.jsx`
Application form for a specific gig. Protected — requires login.

### `PostGig.jsx`
Form for agents to post a new gig. Protected — requires login + agent role.

### `SearchResults.jsx`
Search results page. Reads `?q=` query from URL via `useSearchParams`.

### `PublicProfile.jsx`
Public teenlancer profile at `/profile/:slug`. Visible to anyone.

---

## 13. Components

### `Navbar.jsx`

**States:**
- `photo` — profile photo from localStorage
- `menuOpen` — mobile hamburger menu open/closed
- `unreadCount` — notification badge count
- `showGuard` — role guard modal

**Key behaviors:**
- Fixed at top (`position: fixed`), centered using `left-1/2 -translate-x-1/2`
- After Navbar, a `<div className="h-24" />` spacer pushes page content down
- On mobile: hamburger toggles `menuOpen` → shows dropdown menu
- Notification count fetched from `/notifications/unread-count` on mount
- Real-time update: `socket.on("new_notification", ...)` increments count
- `window.addEventListener("notificationsRead", ...)` resets to 0 when user opens notifications
- "Post a Gig" button checks role — if not agent, shows `RoleGuard` modal instead of navigating

### `GengigChatbot.jsx`

**States:**
- `isOpen` — chat window open/closed
- `messages` — array of `{ role: "user" | "assistant", content }` objects
- `input` — current text input
- `loading` — waiting for AI response
- `hasNewMessage` — shows red badge on button when closed and new message arrived

**Flow:**
1. User types → `setInput()`
2. Presses Enter or send button → `sendMessage()`
3. Checks if user is logged in (reads token from localStorage)
4. Adds user message to `messages` immediately
5. `fetch(...)` to `/chat/send` with message, sessionId, userType
6. Adds assistant reply to `messages`

**Refs:**
- `messagesEndRef` — used to auto-scroll to latest message
- `inputRef` — auto-focuses input when chat opens

### `SplashScreen.jsx`
Shown for ~2 seconds on first load. Controlled by `App.jsx` state `showSplash`.

### `RoleGuard.jsx`
Modal shown when a non-agent tries to post a gig (or vice versa). Prompts them to log in as the correct role or create an account.

### `PremiumButton.jsx`
Renders in the sidebar of both layouts. Navigates to `/premium` when clicked.

### `Toast.jsx` + `hooks/Toast.js`
Custom toast notification system. `useToast()` hook provides `showToast(message, type)` function.

---

## 14. Hooks

### `useRoleGuard.js`
```js
const { showGuard, closeGuard, requireRole, userRole } = useRoleGuard();
```
- `requireRole("agent")` — returns `true` if wrong role (and shows the guard modal), `false` if correct
- Used when an action is role-specific (e.g., posting a gig)

---

## 15. How Responsiveness Works

### Strategy: Mobile-First with Tailwind Breakpoints

Tailwind's responsive classes apply **from a breakpoint upward**:
- No prefix = all screens (mobile default)
- `sm:` = 640px+
- `md:` = 768px+
- `lg:` = 1024px+

### Dashboard Layout Responsiveness

**Sidebar on desktop (`lg:`):**
```jsx
<aside className="hidden lg:flex ...">
```
Shown only on large screens. Hidden on mobile.

**Hamburger button (mobile only):**
```jsx
<button className="lg:hidden fixed bottom-6 right-6 ...">
```
Shown only on small screens. Opens the slide-in drawer.

**Mobile drawer:**
```jsx
<div className="lg:hidden fixed top-0 left-0 h-full w-64 ..."
  style={{ transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)" }}>
```
Slides in from left when `sidebarOpen` is true. CSS `transform` for smooth animation.

**Overlay (backdrop):**
```jsx
{sidebarOpen && <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)} />}
```
Semi-transparent black overlay behind the drawer. Clicking it closes the drawer.

**Stat cards grid:**
```jsx
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
```
2 columns on mobile, 4 columns on desktop.

**Typography:**
```jsx
<h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
```
`clamp(min, preferred, max)` — fluid font size that scales with viewport width.

**Horizontal scrolling tabs (teenlancer dashboard):**
```jsx
<div className="flex gap-2 overflow-x-auto pb-1">
  <button className="whitespace-nowrap flex-shrink-0 ...">
```
Tabs scroll horizontally on mobile instead of wrapping.

**Body overflow fix (prevents white area on mobile):**
```css
html, body {
  background: #060834;
  overflow-x: hidden;
}
```
Prevents horizontal scroll from showing the white browser background.

**Content padding:**
```jsx
<main className="flex-1 p-4 md:p-8">
```
Less padding on mobile (16px), more on desktop (32px).

### Other Responsive Patterns
- `hidden sm:block` — hides elements on very small screens
- `flex-wrap` — lets flex items wrap to new lines on small screens
- `min-w-0` + `truncate` — prevents text overflow in flex containers
- `flex-shrink-0` — prevents elements (avatars, badges) from shrinking

---

## 16. API Endpoints Used

| Endpoint | Method | Used In | Purpose |
|---|---|---|---|
| `/auth/login` | POST | LogIn.jsx | Email/password login |
| `/auth/register` | POST | SignUp.jsx | Registration |
| `/auth/google` | GET | SignUp.jsx | Initiate Google OAuth |
| `/agent/gigs` | GET | AgentDashboard, MyGigs | Fetch agent's gigs |
| `/agent/stats` | GET | AgentDashboard | Agent statistics |
| `/agent/applications` | GET | AgentDashboard, Applications | Fetch applications |
| `/agent/applications?limit=3` | GET | AgentDashboard | Recent 3 applications |
| `/agent/applications/:id/accept` | PUT | Applications.jsx | Accept an applicant |
| `/agent/applications/:id/reject` | PUT | Applications.jsx | Reject an applicant |
| `/teenlancer/stats` | GET | TeenlancerDashboard | Teenlancer stats |
| `/teenlancer/applications` | GET | TeenlancerDashboard | All of user's applications |
| `/notifications/unread-count` | GET | Navbar.jsx | Badge counter |
| `/chat/send` | POST | GengigChatbot.jsx | AI chatbot message |
| `/gigs` | GET | Exploreagig.jsx | Browse all gigs |
| `/gigs/:id` | GET | GigDetails.jsx | Single gig |
| `/gig/:id/apply` | POST | ApplyGig.jsx | Submit application |

---

## 17. Real-time Events (Socket.io)

| Event | Direction | Where | What it does |
|---|---|---|---|
| `join` | Client → Server | App.jsx, LogIn.jsx | Joins user's personal socket room |
| `connect` | Server → Client | App.jsx, socket.js | Socket connected, re-join room |
| `disconnect` | Server → Client | socket.js | Logged to console |
| `reconnect` | Client (internal) | socket.js | Re-joins room after reconnect |
| `new_notification` | Server → Client | Navbar.jsx | Increments badge count |

---

## 18. Supabase Integration

Supabase is used **only for Google OAuth** in this project (not for database storage — that's the Express backend).

```js
// supabase.js
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Google Sign-In flow:**
1. `supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: "..." } })`
2. Supabase redirects user to Google login
3. Google redirects back to our `redirectTo` URL (`/auth/callback`)
4. `GoogleSuccess.jsx` reads the OAuth result and calls our backend to get the app JWT token
5. JWT token stored in localStorage, user navigated to dashboard

**Why use Supabase for OAuth instead of just the backend?**
- Supabase handles the OAuth complexity (token exchange, user session)
- Our backend still issues its own JWT for authorization

---

## 19. Data Flow for a Typical Page Load

Example: Agent opens `/agent/dashboard`

1. **Route check**: `PrivateRoute` reads token from localStorage → found → renders the page
2. **Component mounts**: `useEffect` fires with `[]` dependency (runs once)
3. **Data fetch**: `Promise.all([api.get(...), api.get(...), api.get(...)])` fires
4. **Request interceptor**: Axios adds `Authorization: Bearer <token>` to each request
5. **Response received**: `setAllGigs(...)`, `setStats(...)`, `setRecentApplications(...)`
6. **Loading state off**: `setLoading(false)` → skeleton disappears, real content renders
7. **Computed values**: React re-renders, `.filter()` operations produce `openGigs`, `activeGigs`, etc.

---

## 20. Common Patterns in the Code

### Pattern 1: Optimistic UI Update
Instead of re-fetching after an action, update state directly:
```js
setApplications(prev => prev.map(a =>
    a._id === applicationId ? { ...a, status: "accepted" } : a
));
```

### Pattern 2: Cross-Component Communication via Storage Events
```js
// Sender (after profile update):
window.dispatchEvent(new Event("storage"));

// Receiver (Navbar, Layout):
window.addEventListener("storage", () => {
    setPhoto(localStorage.getItem("photo") || null);
    setName(localStorage.getItem("name") || "My Profile");
});
```

### Pattern 3: Loading States with Skeleton UI
```jsx
{loading ? (
  <div className="animate-pulse" style={{ height: "90px", background: "rgba(255,255,255,0.05)" }} />
) : (
  <div>{/* real content */}</div>
)}
```

### Pattern 4: Graceful Empty States
Every data list has an empty state:
```jsx
{allGigs.length === 0 ? (
  <EmptyState message="No gigs yet" />
) : (
  allGigs.map(gig => <GigRow key={gig._id} gig={gig} />)
)}
```

### Pattern 5: Action Loading Per Item
To show loading on exactly one button without disabling all:
```js
const [actionLoading, setActionLoading] = useState(null);
// Set: setActionLoading(applicationId + "_accept")
// Check: actionLoading === app._id + "_accept"
// Clear: setActionLoading(null)
```

---

## 21. Key localStorage Keys

| Key | What it stores |
|---|---|
| `token` | JWT auth token |
| `role` | `"agent"` or `"teenlancer"` |
| `userId` | User's MongoDB `_id` |
| `name` | Full name |
| `email` | Email address |
| `photo` | Profile photo URL |
| `slug` | URL-friendly profile identifier |
| `bio` | Profile bio |
| `skills` | JSON array of skills (teenlancer) |
| `portfolio` | JSON array of portfolio items |
| `hourlyRate` | (teenlancer) |
| `availability` | (teenlancer) |
| `company` | (agent) |
| `industry` | (agent) |
| `rememberMe` | `"true"` if remember me was checked |

---

## 22. Fixes Applied to the Codebase

These were issues and what was done:

| Problem | Root Cause | Fix |
|---|---|---|
| Login Network Error on Vercel | `api.js` hardcoded `http://localhost:3000` | Changed to `import.meta.env.VITE_API_URL` |
| Chatbot not working on Vercel | `GengigChatbot.jsx` hardcoded `http://localhost:3000/chat/send` | Changed to use `VITE_API_URL` env var |
| Socket not connecting on Vercel | `socket.js` hardcoded `http://localhost:3000` | Changed to use `VITE_API_URL` env var |
| Google OAuth redirected to localhost | `LogIn.jsx` hardcoded `http://localhost:5173/auth/callback` | Changed to `window.location.origin` |
| White area on mobile dashboards | `body` has no background set; dark background only on wrapper div | Added `html, body { background: #060834; overflow-x: hidden; }` in `index.css` |

---

## 23. Questions You Might Be Asked

**Q: What is the role of `api.js`?**
It's a centralized Axios instance shared across the whole app. It automatically adds the auth token to every request (via request interceptor) and automatically logs the user out on 401 errors (via response interceptor). This means no page has to handle auth headers or 401s manually.

**Q: Why do you use `Promise.all()` in the dashboards?**
To make multiple API calls simultaneously instead of sequentially. If each call takes 300ms, doing 3 calls with `Promise.all` takes ~300ms total. Doing them one after another takes ~900ms.

**Q: What happens if the token expires?**
The response interceptor in `api.js` catches the 401 response, removes the token and role from localStorage, and redirects to `/signin`. The user doesn't see a confusing error.

**Q: How does the Navbar know to update the profile photo when the user changes it?**
The profile page dispatches `window.dispatchEvent(new Event("storage"))` after updating. The Navbar listens with `window.addEventListener("storage", ...)` and re-reads from `localStorage`.

**Q: How do you protect routes?**
With the `PrivateRoute` component in `AppRouter.jsx`. It checks for a token in localStorage or sessionStorage. If none is found, it redirects to `/signin` using `<Navigate replace>`.

**Q: What does `replace` do in `<Navigate replace>`?**
It replaces the current entry in the browser history instead of adding a new one. So if you hit the back button, you don't loop back to the protected page.

**Q: How does the mobile sidebar work?**
It's a fixed-position div that is always rendered but positioned off-screen with `transform: translateX(-100%)`. When `sidebarOpen` is true, the transform changes to `translateX(0)` and CSS transition animates the slide-in. There's also a semi-transparent overlay that closes it when clicked.

**Q: What is Supabase used for?**
Only for Google OAuth. The Supabase client initiates the OAuth flow. Our Express backend issues its own JWT tokens — Supabase doesn't store the app's data.

**Q: Why store user data in localStorage instead of using Context/Redux?**
It's simpler for this app's scale. localStorage persists across page refreshes automatically. The downside is that updates don't automatically re-render components — you have to dispatch a storage event and listen for it.

**Q: How does the socket know which user to send notifications to?**
When a user logs in, the client emits `socket.emit("join", { userId })`. The server puts that socket into a room named by the userId. When the server wants to notify a specific user, it emits to that room: `io.to(userId).emit("new_notification", ...)`.

**Q: What is `clamp()` used for?**
CSS `clamp(min, preferred, max)` creates fluid typography. `clamp(1.5rem, 3vw, 2.5rem)` means: at least 24px, scale with 3% of viewport width, never more than 40px. This makes text look good on all screen sizes without media queries.

**Q: Why is `GengigChatbot` placed inside the flex container but has fixed positioning?**
Because its children use `position: fixed`, they're removed from the normal document flow and don't affect the flex layout. The component is placed there structurally for organization but doesn't create visual space in the layout.

**Q: What is StrictMode in `main.jsx`?**
`<StrictMode>` makes React run certain checks in development only. It intentionally renders components twice and fires effects twice to help you catch side effects and bugs. It has no effect in production builds.

---

## 24. Design System

| Color | Hex | Used for |
|---|---|---|
| Background | `#060834` | Page/layout background |
| Accent | `#FFC085` | Primary brand color, active states, CTAs |
| Accent dark | `#e8a060` | Gradient end for buttons |
| Text primary | `white` / `#fff` | Headings, important text |
| Text secondary | `#B2B2D2` | Descriptions, labels |
| Success | `#4ade80` | Accepted, completed status |
| Warning | `#FFC085` | Pending, active status |
| Danger | `#f87171` | Rejected, errors, revision |
| Info | `#63b3ed` | Open gig status |
| Purple | `#a78bfa` | Teenlancers hired stat |

**Card style:**
```
background: rgba(255,255,255,0.05)
border: 1px solid rgba(255,255,255,0.08)
border-radius: 1rem (rounded-2xl)
```

**Gradient buttons:**
```
background: linear-gradient(90deg, #FFC085, #e8a060)
```

---

*Last updated: May 2026 — covers all changes applied before Sunday's discussion.*
