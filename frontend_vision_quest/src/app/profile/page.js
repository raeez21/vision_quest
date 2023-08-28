'use client'

import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { useAuth } from '../../../components/AuthContext';
import { SidebarMenu } from '../../../components/SidebarMenu';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function Profile() {
    const { authToken, logout } = useAuth()
    const [profileData, setProfileData] = useState(null);

    const handleLogout = () => {
        logout(); 
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/profile/', {
                    method: 'GET',
                    headers: {
                        Authorization: `Token ${authToken}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfileData(data);
                } else {
                    // Handle API error
                    console.error('Profile API error:', response);
                }
            } catch (error) {
                console.error('Profile API error:', error);
            }
        };

        if (authToken) {
            fetchProfile();
        }
    }, [authToken]);

    return (
        <>
            { authToken && <SidebarMenu />}
            <div className="flex flex-col h-screen justify-between">
                <Header />
                <main className="container mb-auto mx-auto mt-28">
                    <div className="bg-gray-100 p-6 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
                        {authToken ? (
                            <div>
                                <p className="mb-2">
                                    <span className="font-semibold">Username:</span> {profileData?.username}
                                </p>
                                <p className="mb-2">
                                    <span className="font-semibold">Email:</span> {profileData?.email}
                                </p>
                                <p className="mb-2">
                                    <span className="font-semibold">First Name:</span> {profileData?.first_name}
                                </p>
                                <p>
                                    <span className="font-semibold">Last Name:</span> {profileData?.last_name}
                                </p>
                                {/* <p>
                                    <span className="font-semibold">Last Name:</span> {session.user.last_name}
                                </p> */}
                            </div>
                            ) : (
                            <p>Please sign in to view your profile.</p>
                        )}
                        {authToken ? (
                            <button 
                                onClick={handleLogout}
                                className='mt-10 hover:bg-slate-500 font-bold hover:text-slate-300 px-8 py-3 rounded bg-slate-300 text-slate-500'
                            >
                                Logout
                            </button>
                        ):(
                            <div className='mt-10'>
                                <Link 
                                    className='hover:bg-slate-500 font-bold hover:text-slate-300 px-8 py-3 rounded bg-slate-300 text-slate-500'
                                    href='/signin'
                                >
                                    Signin
                                </Link>
                            </div>
                        )}
                    </div>
                </main>
                <div className="z-10"><Footer /></div>
            </div>
        </>
    );
}

export default Profile;
