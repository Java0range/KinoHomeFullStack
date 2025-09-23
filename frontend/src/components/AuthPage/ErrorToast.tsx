"use client";

import React, { useEffect, useRef, useState } from "react";

type Position = "top-right" | "top-left" | "bottom-right" | "bottom-left";

type ErrorToastProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    duration?: number; // ms
    position?: Position;
    action?: { label: string; onClick: () => void };
    showIcon?: boolean;
};

const positionClasses: Record<Position, string> = {
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
};

export function ErrorToast({
                               open,
                               onClose,
                               title = "Ошибка",
                               message,
                               duration = 6000,
                               position = "bottom-right",
                               action,
                               showIcon = true,
                           }: ErrorToastProps) {
    const [remaining, setRemaining] = useState(duration);
    const [paused, setPaused] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const startedAtRef = useRef<number>(0);
    const [reduced, setReduced] = useState(false);

    // Respect prefers-reduced-motion
    useEffect(() => {
        if (typeof window === "undefined") return;
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const handler = () => setReduced(mq.matches);
        handler();
        mq.addEventListener?.("change", handler);
        return () => mq.removeEventListener?.("change", handler);
    }, []);

    // Start/stop auto-close timer
    useEffect(() => {
        if (!open) return;
        setRemaining(duration);
        startedAtRef.current = Date.now();

        if (!reduced) {
            timerRef.current = setTimeout(onClose, duration);
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, duration, reduced]);

    // Pause/resume on hover
    const handleMouseEnter = () => {
        if (!open || reduced) return;
        if (timerRef.current) clearTimeout(timerRef.current);
        const elapsed = Date.now() - startedAtRef.current;
        setRemaining((prev) => Math.max(0, prev - elapsed));
        setPaused(true);
    };

    const handleMouseLeave = () => {
        if (!open || reduced) return;
        setPaused(false);
        startedAtRef.current = Date.now();
        timerRef.current = setTimeout(onClose, remaining);
    };

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    const baseTranslate =
        position.includes("right") ? "translate-x-6" : "-translate-x-6";

    return (
        <div
            className={`pointer-events-none fixed z-50 ${positionClasses[position]} max-w-sm sm:max-w-md`}
            aria-live="assertive"
            role="status"
        >
            <div
                className={[
                    "pointer-events-auto w-full select-none overflow-hidden rounded-xl border",
                    "border-neutral-800/70 bg-neutral-950/90",
                    "backdrop-blur-md shadow-lg ring-1 ring-red-600/20",
                    "transition-all duration-300 ease-out will-change-transform",
                    open
                        ? "opacity-100 translate-x-0"
                        : `opacity-0 ${baseTranslate} pointer-events-none`,
                    // subtle outer glow in red tone
                    "shadow-red-900/30",
                    // subtle red radial gradient “Netflix feel”
                    "bg-[radial-gradient(1200px_400px_at_100%_0%,rgba(220,38,38,0.10),transparent_60%)]",
                ].join(" ")}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                role="alert"
                aria-atomic="true"
            >
                <div className="relative p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                        {showIcon && (
                            <div
                                className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-red-600/15 text-red-500 ring-1 ring-inset ring-red-600/30"
                                aria-hidden="true"
                            >
                                {/* Exclamation Triangle Icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M11.25 9V13.5M11.25 17.25h.008v.008H11.25V17.25Zm-.374-13.043a1.5 1.5 0 0 1 2.248 0l9.39 10.792c.88 1.011.152 2.626-1.124 2.626H2.358c-1.276 0-2.004-1.615-1.124-2.626L10.876 4.207Z"
                                    />
                                </svg>
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-white/95">
                                {title}
                            </p>
                            <p className="mt-1 text-sm text-neutral-300">
                                {message}
                            </p>
                            {action && (
                                <div className="mt-3">
                                    <button
                                        onClick={action.onClick}
                                        className={[
                                            "inline-flex items-center gap-2 rounded-md px-3 py-1.5",
                                            "text-sm font-medium text-red-100",
                                            "bg-red-600/20 hover:bg-red-600/30",
                                            "ring-1 ring-inset ring-red-600/40",
                                            "transition-colors",
                                        ].join(" ")}
                                    >
                                        {action.label}
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={onClose}
                            aria-label="Закрыть уведомление"
                            className={[
                                "flex h-8 w-8 flex-none items-center justify-center rounded-md",
                                "text-neutral-300 hover:text-white",
                                "hover:bg-white/5 transition-colors",
                            ].join(" ")}
                        >
                            {/* X icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Bottom progress bar (time left). Pauses on hover */}
                    {!reduced && (
                        <div
                            className="pointer-events-none absolute inset-x-0 bottom-0"
                            aria-hidden="true"
                        >
                            <div
                                className="h-0.5 bg-red-600/80 animate-toast-progress"
                                style={
                                    {
                                        "--toast-duration": `${remaining}ms`,
                                        animationPlayState: paused ? "paused" as const : "running",
                                    } as React.CSSProperties
                                }
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}