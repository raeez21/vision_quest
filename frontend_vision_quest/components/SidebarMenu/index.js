import React from 'react';
import Link from 'next/link';
// import { useRouter } from 'next/router';

export const SidebarMenu = () => {
    // const router = useRouter();

    // const isActive = (route) => {
    //     return router.pathname === route ? 'text-blue-500' : 'text-white';
    // };
    return (
        <div>
            <nav className="fixed left-0 top-0 bg-white w-1/4 shadow-md">
                <div className="flex flex-col space-y-4">
                    <div className="p-4">
                        <Link 
                            href="/dashboard"
                            className="hover:text-blue-500 text-gray-700 font-bold"
                        >
                            Dashboard
                        </Link>
                    </div>
                    <div className="p-4">
                        <Link 
                            href="/analyse"
                            className="hover:text-blue-500 text-gray-700 font-bold"
                        >
                            Analyse
                        </Link>
                    </div>
                    <div className='p-4'>
                        <Link 
                            href="/results"
                            className="hover:text-blue-500 text-gray-700 font-bold"
                        >
                            Results
                        </Link>
                    </div>
                </div>
            </nav>
        </div>
    );
};
