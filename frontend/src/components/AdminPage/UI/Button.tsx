import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
    className?: string;
    type?: 'button' | 'submit';
}

export const Button: React.FC<ButtonProps> = ({
                                                  children,
                                                  variant = 'primary',
                                                  size = 'md',
                                                  onClick,
                                                  className = '',
                                                  type = 'button',
                                              }) => {
    const baseStyles = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2';

    const variantStyles = {
        primary: 'bg-red-600 hover:bg-red-700 text-white',
        danger: 'bg-red-600/20 hover:bg-red-600/30 text-red-500 border border-red-600/50',
        ghost: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300',
    };

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        >
            {children}
        </button>
    );
};