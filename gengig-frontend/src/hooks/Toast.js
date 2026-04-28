import { useState, useCallback } from "react";

export function useToast() {
    const [toast, setToast] = useState(null);
    // type: "success" | "error"
    const showToast = useCallback((message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    }, []);

    return { toast, showToast };
}