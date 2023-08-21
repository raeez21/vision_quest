"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const SidebarMenu = () => {
    const router = usePathname();
    const isActive = (route) => {
        return router === route ? 'bg-gray-600' : 'text-gray-700';
    };
    return (
        <div>
            <nav className="fixed left-0 top-0 bg-white w-1/4 shadow-md">
                <div className="flex flex-col space-y-4">
                    <Link 
                        href="/dashboard"
                        className={`p-4 font-bold ${isActive('/dashboard')}`}>
                            Dashboard
                    </Link>
                    <Link 
                        href="/analyse"
                        className={`p-4 font-bold ${isActive('/analyse')}`}>
                            Analyse
                    </Link>
                    <Link 
                        href="/results"
                        className={`p-4 font-bold ${isActive('/results')}`}>
                            Results
                    </Link>
                </div>
            </nav>
        </div>
    );
};
