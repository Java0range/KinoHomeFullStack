import React, { useState, useMemo } from 'react';
import { UsersTable } from './UsersTable';
import { UserModal } from './UserModal';
import { Button } from '../UI/Button';
import { User } from "@/models/UserModels";
import { useGetUsers } from "@/hooks/AdminUsersHooks";
import { useDebounce } from "@/hooks/useDebounce";
import AdminUsersService from "@/services/AdminUsersService";

export const UsersSection = () => {
    const { data: users = [], isLoading: UsersIsLoading, isError: UsersIsError, refetch: usersRefetch } = useGetUsers();

    console.log(users);

    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 300);

    const filteredUsers = useMemo(() => {
        if (!debouncedSearch.trim()) {
            return users;
        }

        const query = debouncedSearch.toLowerCase().trim();
        return users.filter((user) =>
            user.username.toLowerCase().includes(query)
        );
    }, [users, debouncedSearch]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleCreate = () => {
        setModalMode('create');
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user: User) => {
        setModalMode('edit');
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = async (userId: string) => {
        await AdminUsersService.deleteUser(userId);
        await usersRefetch();
        console.log(`Пользователь ${userId} удален`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Пользователи</h2>
                    <p className="text-sm text-zinc-500 mt-1">
                        Управление пользователями системы и правами доступа
                    </p>
                </div>
                <Button onClick={handleCreate}>
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
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Добавить пользователя
                </Button>
            </div>

            {/* Search */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Поиск по логину..."
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg
                                   text-white placeholder-zinc-500 focus:outline-none focus:border-red-600"
                    />
                    {/* Кнопка очистки */}
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
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
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            {UsersIsLoading ? (
                <div className="text-zinc-400">Загрузка...</div>
            ) : UsersIsError ? (
                <div className="text-red-500">Ошибка загрузки</div>
            ) : filteredUsers.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
                    <svg
                        className="w-12 h-12 text-zinc-600 mx-auto mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                    </svg>
                    <p className="text-zinc-400">
                        {debouncedSearch
                            ? `Пользователи с именем "${debouncedSearch}" не найдены`
                            : 'Нет пользователей'
                        }
                    </p>
                    {debouncedSearch && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="mt-3 text-sm text-red-500 hover:text-red-400 transition-colors"
                        >
                            Сбросить поиск
                        </button>
                    )}
                </div>
            ) : (
                <>
                    {/* Счётчик результатов */}
                    {debouncedSearch && (
                        <p className="text-sm text-zinc-500">
                            Найдено: {filteredUsers.length} из {users.length}
                        </p>
                    )}
                    <UsersTable
                        users={filteredUsers}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </>
            )}

            {/* Modal */}
            <UserModal
                isOpen={isModalOpen}
                usersRefetch={usersRefetch}
                onClose={() => setIsModalOpen(false)}
                mode={modalMode}
                userData={selectedUser}
            />
        </div>
    );
};