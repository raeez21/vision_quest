'use client'

import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { useAuth } from '../../../components/AuthContext';
import { useRouter } from 'next/navigation';
import { SidebarMenu } from '../../../components/SidebarMenu';
import Link from 'next/link';

function Profile() {
    const { authToken, logout } = useAuth()
    const router = useRouter();

    const handleLogout = () => {
        logout(); 
        router.push('/'); 
        console.log("Log out success!!")
    };

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
                                    <span className="font-semibold">Username:</span> user
                                </p>
                                <p className="mb-2">
                                    <span className="font-semibold">Email:</span> abc@g.com
                                </p>
                                <p className="mb-2">
                                    <span className="font-semibold">First Name:</span> name1
                                </p>
                                <p>
                                    <span className="font-semibold">Last Name:</span> name2
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
