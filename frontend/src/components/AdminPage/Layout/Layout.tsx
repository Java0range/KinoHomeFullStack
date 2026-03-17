"use client"


import React, {useState} from 'react';
import {Header} from './Header';
import {Sidebar} from './Sidebar';
import {UsersSection} from '../Users/UsersSection';
import {MoviesSection} from '../Movies/MoviesSection';
import {TorrentsSection} from '../Torrents/TorrentsSection';
import {useGetUserInfo} from "@/hooks/AuthHooks";
import {UserPermission} from "@/models/UserModels";

export const Layout: React.FC = () => {
    const { data: userData, isLoading } = useGetUserInfo();

    const [activeSection, setActiveSection] = useState('movies');

    const renderSection = () => {
        switch (activeSection) {
            case 'users':
                return <UsersSection />;
            case 'movies':
                return <MoviesSection />;
            case 'torrents':
                return <TorrentsSection />;
            default:
                return <UsersSection />;
        }
    };

    return (
        <div className="min-h-screen bg-black">
            <Header
                userPermissions={userData?.permissions ? userData?.permissions : UserPermission.USER}
            />
            <div className="flex">
                <Sidebar
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                    userPermissions={userData?.permissions ? userData?.permissions : UserPermission.USER}
                />
                <main className="flex-1 p-6">{renderSection()}</main>
            </div>
        </div>
    );
};