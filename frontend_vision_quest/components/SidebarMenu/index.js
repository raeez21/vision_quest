"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const SidebarMenu = () => {
    const router = usePathname();
    const isActive = (route) => {
        return router === route ? 'bg-gray-600 text-slate-300 ' : 'text-slate-300 opacity-50 hover:opacity-100';
    };
    return (
        <nav className="fixed left-0 top-0 bg-gray-800 shadow-2xl w-1/4 h-screen flex flex-col justify-center">
            <div className="flex flex-col">
                <Link 
                    href="/dashboard"
                    className={`p-4 font-bold ${isActive('/dashboard')} rounded-lg transition duration-300`}
                >
                        Dashboard
                </Link>
                <Link 
                    href="/analyse"
                    className={`p-4 font-bold ${isActive('/analyse')} rounded-lg transition duration-300`}>
                        Analyse
                </Link>
                <Link 
                    href="/profile"
                    className={`p-4 font-bold ${isActive('/profile')} rounded-lg transition duration-300`}>
                        Profile
                </Link>
            </div>
        </nav>
    );
};
