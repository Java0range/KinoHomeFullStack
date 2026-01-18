"use client"


import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { UsersSection } from '../Users/UsersSection';
import { MoviesSection } from '../Movies/MoviesSection';
import { TorrentsSection } from '../Torrents/TorrentsSection';

export const Layout: React.FC = () => {
    const [activeSection, setActiveSection] = useState('users');

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
            <Header />
            <div className="flex">
                <Sidebar
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                />
                <main className="flex-1 p-6">{renderSection()}</main>
            </div>
        </div>
    );
};