import React from 'react';

interface InputProps {
    label?: string;
    type?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

export const Input: React.FC<InputProps> = ({
                                                label,
                                                type = 'text',
                                                placeholder,
                                                value,
                                                onChange,
                                                className = '',
                                            }) => {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {label && (
                <label className="text-sm font-medium text-zinc-400">{label}</label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg
                   text-white placeholder-zinc-500 focus:outline-none focus:border-red-600
                   focus:ring-1 focus:ring-red-600 transition-all duration-200"
            />
        </div>
    );
};