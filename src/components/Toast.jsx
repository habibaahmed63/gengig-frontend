export default function Toast({ toast }) {
    if (!toast) return null;
    return (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-full text-sm font-semibold text-white shadow-lg flex items-center gap-2 animate-fade-in"
            style={{
                background: toast.type === "error"
                    ? "rgba(248,113,113,0.95)"
                    : "linear-gradient(90deg, #FFC085, #e8a060)",
            }}>
            <span>{toast.type === "error" ? "✕" : "✓"}</span>
            {toast.message}
        </div>
    );
}