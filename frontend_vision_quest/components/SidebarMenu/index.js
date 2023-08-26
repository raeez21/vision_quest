"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const SidebarMenu = () => {
    const router = usePathname();
    const isActive = (route) => {
        return router === route ? 'bg-gray-600 text-slate-300 hover:bg-gray-400' : 'text-slate-500 hover:bg-gray-400';
    };
    return (
        <nav className="fixed left-0 top-0 bg-white w-1/4 shadow-md h-screen flex flex-col justify-center">
            <div className="flex flex-col">
                <Link 
                    href="/dashboard"
                    className={`p-4 font-bold ${isActive('/dashboard')} `}>
                        Dashboard
                </Link>
                <Link 
                    href="/analyse"
                    className={`p-4 font-bold ${isActive('/analyse')} `}>
                        Analyse
                </Link>
                <Link 
                    href="/profile"
                    className={`p-4 font-bold ${isActive('/profile')} `}>
                        Profile
                </Link>
            </div>
        </nav>
    );
};
