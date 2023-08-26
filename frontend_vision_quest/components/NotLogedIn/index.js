"use client"

import Link from "next/link";

const NotLogedIn = ({ page, heading }) => {
    return (
        <main className="container mt-28 mb-auto mx-auto h-screen">
            <div className="bg-gray-100 p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">{heading}</h2>
                <p>Please sign in to view {page}.</p>
                <div className='mt-10'>
                    <Link 
                        className='hover:bg-slate-500 font-bold hover:text-slate-300 px-8 py-3 rounded bg-slate-300 text-slate-500'
                        href='/signin'
                    >
                        Signin
                    </Link>
                </div>
            </div>
        </main>
    )
};

export default NotLogedIn;
