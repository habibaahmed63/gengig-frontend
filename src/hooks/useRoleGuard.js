import { useState } from "react";

export function useRoleGuard() {
    const [showGuard, setShowGuard] = useState(false);
    const role = localStorage.getItem("role");

    const requireRole = (requiredRole) => {
        if (!role) {
            return false;
        }
        if (role !== requiredRole) {
            setShowGuard(true);
            return true; 
        }
        return false; 
    };

    return {
        showGuard,
        closeGuard: () => setShowGuard(false),
        requireRole,
        userRole: role,
    };
}