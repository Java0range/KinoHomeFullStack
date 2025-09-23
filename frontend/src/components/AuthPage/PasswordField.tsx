'use client'

import { useState } from 'react'


export default function PasswordField() {
    const [show, setShow] = useState(false)

    return (
        <div className="group/input relative">
            <svg
                aria-hidden
                className="pointer-events-none absolute left-4 top-[18px] h-5 w-5 text-neutral-500 transition-colors duration-200 group-focus-within/input:text-red-500"
                viewBox="0 0 24 24" fill="currentColor"
            >
                <path d="M17 9h-1V7A4 4 0 0 0 7 7v2H6a1 1 0 0 0-1 1v10c0 .6.4 1 1 1h11a1 1 0 0 0 1-1V10a1 1 0 0 0-1-1Zm-8-2a3 3 0 0 1 6 0v2H9V7Zm6 11H7v-6h8v6Z" />
            </svg>

            <input
                id="password"
                name="password"
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder=" "
                className="peer w-full rounded-lg border border-neutral-800/80 bg-neutral-900/70 px-11 py-4 text-[15px] text-white outline-none ring-0 transition-all duration-200 placeholder:text-transparent hover:border-neutral-700 focus:border-red-600 focus:bg-neutral-900/80 focus:shadow-[0_0_0_3px_rgba(220,38,38,.15)]"
                required
            />

            <label
                htmlFor="password"
                className="pointer-events-none absolute left-11 top-2 translate-y-0 text-xs text-neutral-400 transition-all duration-200
                   peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
                   peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-red-400"
            >
                Пароль
            </label>

            <button
                type="button"
                onMouseDown={(e) => e.preventDefault()} // сохраняем фокус на инпуте
                onClick={() => setShow((s) => !s)}
                aria-label={show ? 'Скрыть пароль' : 'Показать пароль'}
                aria-pressed={show}
                title={show ? 'Скрыть пароль' : 'Показать пароль'}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-2 text-neutral-500 transition-colors hover:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-red-600/60"
            >
                {show ? <EyeOffIcon /> : <EyeIcon />}
            </button>
        </div>
    )
}

function EyeIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="drop-shadow-[0_0_6px_rgba(0,0,0,.2)]">
            <path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7Z" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    )
}

function EyeOffIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="drop-shadow-[0_0_6px_rgba(0,0,0,.2)]">
            <path d="M3 3l18 18M10.58 10.58A3 3 0 0 0 12 15a3 3 0 0 0 2.42-4.42M9.88 5.09A10.8 10.8 0 0 1 12 5c5 0 9.27 3.11 11 7-.66 1.48-1.68 2.83-2.95 3.95M6.1 6.1A11.26 11.26 0 0 0 1 12c.66 1.48 1.68 2.83 2.95 3.95A12 12 0 0 0 12 19c1.06 0 2.08-.14 3.04-.41" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    )
}