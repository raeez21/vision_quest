"use client"

import Link from "next/link";

const NotLogedIn = ({ page, heading }) => {
    return (
        <main className="container mt-28 mb-auto mx-auto h-screen">
            <div className="p-6 rounded-md shadow-2xl bg-gray-800 opacity-70 hover:opacity-100 hover:bg-gray-800 transition duration-300">
                <h2 className="text-2xl font-bold mb-4">{heading}</h2>
                <p>Please sign in to view {page}.</p>
                <div className='mt-10'>
                    <Link 
                        className=' font-bold  px-8 py-3 rounded bg-white text-purple-700 hover:bg-purple-700 hover:text-white transition duration-500'
                        href='/signin'
                        // style={{
                        //     color: 'rgba(103, 6, 206, 1)',
                        //     backgroundColor: 'rgba(255, 255, 255, 1)'
                        // }}
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </main>
    )
};

export default NotLogedIn;
