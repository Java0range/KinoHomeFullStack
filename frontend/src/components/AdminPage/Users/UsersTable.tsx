import React from 'react';
import {User, UserPermission} from "@/models/UserModels";

interface UsersTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (userId: string) => void;
}

const getPermissionBadgeConfig = (permission: UserPermission) => {
    switch (permission) {
        case 'ADMIN':
            return {
                label: 'Админ',
                className: 'bg-red-600/20 text-red-500 border border-red-600/30',
            };
        case 'MODERATOR':
            return {
                label: 'Модератор',
                className: 'bg-amber-600/20 text-amber-400 border border-amber-600/30',
            };
        default:
            return {
                label: 'Пользователь',
                className: 'bg-zinc-800 text-zinc-400 border border-zinc-700',
            };
    }
};

export const UsersTable: React.FC<UsersTableProps> = ({
                                                          users,
                                                          onEdit,
                                                          onDelete,
                                                      }) => {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full">
                <thead>
                <tr className="border-b border-zinc-800">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-400">
                        ID
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-400">
                        Логин
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-400">
                        Роль
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-zinc-400">
                        Действия
                    </th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => {
                    const badge = getPermissionBadgeConfig(user.permissions);

                    return (
                        <tr
                            key={user.id}
                            className="border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 transition-colors"
                        >
                            <td className="px-6 py-4 text-sm text-zinc-500">#{user.id}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-zinc-400">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                                    </div>
                                    <span className="text-sm font-medium text-white">
                      {user.username}
                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                  <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => onEdit(user)}
                                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => onDelete(user.db_id)}
                                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-600/10 rounded-lg transition-colors"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};