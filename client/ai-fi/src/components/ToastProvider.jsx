import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const addToast = useCallback(({ title, message, tone = 'info', duration = 3500 }) => {
        const id = crypto.randomUUID();
        setToasts((prev) => [...prev, { id, title, message, tone }]);
        setTimeout(() => removeToast(id), duration);
    }, [removeToast]);

    const value = useMemo(() => ({ addToast }), [addToast]);

    const toneStyles = {
        info: 'border-white/20 text-white/90 bg-white/10',
        success: 'border-emerald-400/40 text-emerald-100 bg-emerald-900/40',
        error: 'border-red-400/40 text-red-100 bg-red-900/40'
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="fixed top-4 right-4 space-y-2 z-50 w-[280px]">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`border p-3 rounded-xl backdrop-blur-lg shadow-lg shadow-black/30 ${toneStyles[toast.tone] || toneStyles.info}`}
                    >
                        <div className="text-xs uppercase tracking-[0.2em] text-white/60">{toast.title || 'Notice'}</div>
                        {toast.message && <div className="text-sm mt-1">{toast.message}</div>}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return ctx.addToast;
};
