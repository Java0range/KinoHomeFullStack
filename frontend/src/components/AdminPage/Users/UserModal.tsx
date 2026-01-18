import React, { useState, useEffect } from 'react';
import { Modal } from '../UI/Modal';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import {User, UserPermission} from "@/models/UserModels";
import AdminUsersService from "@/services/AdminUsersService";

interface UserModalProps {
    isOpen: boolean;
    usersRefetch: () => void;
    onClose: () => void;
    mode: 'create' | 'edit';
    userData: User | null;
}

const roleConfig: Record<UserPermission, { label: string; description: string }> = {
    USER: {
        label: 'Пользователь',
        description: 'Базовые права доступа',
    },
    MODERATOR: {
        label: 'Модератор',
        description: 'Может модерировать контент и управлять публикациями',
    },
    ADMIN: {
        label: 'Администратор',
        description: 'Полный доступ ко всем функциям системы',
    },
};

export const UserModal: React.FC<UserModalProps> = ({
                                                        isOpen,
                                                        usersRefetch,
                                                        onClose,
                                                        mode,
                                                        userData,
                                                    }) => {
    const [permissions, setPermissions] = useState<UserPermission>('USER' as UserPermission);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {
        switch (mode) {
            case 'create':
                await AdminUsersService.createUser(username, password, permissions);
                usersRefetch();
                onClose();
                break;
            case 'edit':
                if (!userData) return;
                await AdminUsersService.updateUser(userData.db_id, username, password, permissions);
                usersRefetch();
                onClose();
                break;
        }
    }

    // Сброс/инициализация при открытии модалки
    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && userData) {
                setPermissions(userData.permissions);
                setUsername(userData.username);
            } else {
                setPermissions('USER' as UserPermission);
                setUsername('');
            }
        }
    }, [isOpen, mode, userData]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={mode === 'create' ? 'Создать пользователя' : 'Редактировать пользователя'}
        >
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <Input
                    label="Логин"
                    placeholder="Введите логин"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <Input
                    label="Пароль"
                    type="password"
                    placeholder={mode === 'edit' ? 'Оставьте пустым, чтобы не менять' : 'Введите пароль'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {/* Role Selector */}
                <div className="space-y-3">
                    <p className="text-sm font-medium text-white">Роль</p>

                    {/* Segmented Control */}
                    <div className="flex rounded-lg bg-zinc-800 p-1 gap-1">
                        {(['USER', 'MODERATOR', 'ADMIN'] as UserPermission[]).map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setPermissions(r)}
                                className={`
                  flex-1 px-3 py-2 text-sm font-medium rounded-md 
                  transition-all duration-200
                  ${permissions === r
                                    ? r === 'ADMIN'
                                        ? 'bg-red-600 text-white shadow-sm'
                                        : r === 'MODERATOR'
                                            ? 'bg-amber-600 text-white shadow-sm'
                                            : 'bg-zinc-600 text-white shadow-sm'
                                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50'
                                }
                `}
                            >
                                {roleConfig[r].label}
                            </button>
                        ))}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-zinc-500">
                        {roleConfig[permissions].description}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                    <Button variant="ghost" onClick={onClose} className="flex-1">
                        Отмена
                    </Button>
                    <Button onClick={handleSubmit} type="submit" className="flex-1">
                        {mode === 'create' ? 'Создать' : 'Сохранить'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};