import React from 'react';
import Image from "next/image";

export const Header: React.FC = () => {
    return (
        <header className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6">
            {/* Logo Placeholder */}
            <div className="flex items-center gap-3">
                <Image
                    className="inline-flex h-9 w-9 items-center justify-center rounded bg-red-600 shadow-[0_0_24px_-6px_rgba(220,38,38,.8)]"
                    src="/KinoHomeLogo.png"
                    alt="logo"
                    width={60}
                    height={60}
                />
                <div>
                    <span className="text-white text-xl font-extrabold tracking-tight">
                            Кино<span className="text-red-600 transition-colors duration-300">Дом</span>
                    </span>
                    <p className="text-xs text-zinc-500">Админ-панель</p>
                </div>
            </div>

            {/* Admin Info */}
            <div className="flex items-center gap-4">
            <div className="text-right">
                    <p className="text-sm font-medium text-white">Администратор</p>
                </div>
                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                    <svg
                        className="w-5 h-5 text-zinc-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                </div>
            </div>
        </header>
    );
};