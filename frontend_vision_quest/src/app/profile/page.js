'use client'

import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { useAuth } from '../../../components/AuthContext';
import { SidebarMenu } from '../../../components/SidebarMenu';
import { useEffect, useState } from 'react';
import NotLogedIn from '../../../components/NotLogedIn';

function Profile() {
    const { authToken, logout } = useAuth()
    const [profileData, setProfileData] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [feedback, setFeedback] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
  
      // Display success message
      setShowSuccessMessage(true);
  
      // Clear the feedback input
      setFeedback("");
    };

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
                { authToken ? (
                    <main className="container mb-auto mx-auto mt-28">
                        <h2 className="text-4xl text-center font-bold p-10">Your Profile</h2>
                        <div className='flex justify-center'>
                            <div className="w-1/2 mr-5 p-6 rounded-md shadow-2xl bg-gray-800 opacity-100 transition duration-300">
                                <h2 className="text-2xl font-bold mb-4">Your Details</h2>
                                <div className="text-white">
                                    <div className="mb-4">
                                        <span className="font-semibold text-gray-400">First Name:</span>{" "}
                                        <span className="text-lg font-semibold">{profileData?.first_name}</span>
                                    </div>
                                    <div className="mb-4">
                                        <span className="font-semibold text-gray-400">Last Name:</span>{" "}
                                        <span className="text-lg font-semibold">{profileData?.last_name}</span>
                                    </div>
                                    <div className="mb-4">
                                        <span className="font-semibold text-gray-400">Username:</span>{" "}
                                        <span className="text-lg font-semibold">{profileData?.username}</span>
                                    </div>
                                    <div className="mb-4">
                                        <span className="font-semibold text-gray-400">Email:</span>{" "}
                                        <span className="text-lg font-semibold">{profileData?.email}</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleLogout}
                                    className='mt-10 font-bold  px-8 py-3 rounded bg-white text-purple-700 hover:bg-purple-700 hover:text-white transition duration-500'
                                >
                                    Logout
                                </button>
                            </div>

                            {/* Feedback Form */}
                            <div className="w-1/2 p-6 ml-5 rounded-md shadow-2xl bg-gray-800 opacity-70 hover:opacity-100 hover:bg-gray-800 transition duration-300">
                                <h3 className="text-lg font-semibold text-white mb-2">Provide Feedback</h3>
                                <form onSubmit={handleSubmit}>
                                    <textarea
                                        className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:border-blue-300"
                                        rows="4"
                                        placeholder="Your feedback here..."
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                    ></textarea>
                                    <button
                                        type="submit"
                                        className="mt-2 px-4 py-2 rounded bg-purple-700 text-white hover:bg-purple-800 transition duration-300"
                                    >
                                        Submit Feedback
                                    </button>
                                </form>
                                {/* Success Message */}
                                {showSuccessMessage && (
                                    <div className="mt-4 text-green-500">
                                    Your valuable feedback has been received. We'll be in touch soon!!
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Billing Plan */}
                        <div className="mt-6 bg-gray-700 p-4 rounded-lg ">
                            <h3 className="text-lg font-semibold hover:text-gray-100 font-sans">Billing Plan: FREE TIER</h3>
                            <p className="text-gray-300 mt-2">
                                You are currently on the <span className="font-semibold font-sans">Free Tier</span> plan.
                                Upgrade to access more features.
                            </p>
                        </div>

                        {/* Premium Plans Coming Soon Banner */}
                        <div className="mt-6 p-2 rounded-lg bg-gradient-to-r from-purple-700 to-cyan-500 text-gray-100 text-center opacity-90 hover:opacity-100">
                            <p className="font-semibold text-xl font-sans">Premium Plans Coming Soon!</p>
                            <p className="text-sm">Stay tuned for exciting premium features.</p>
                        </div>
                    </main>
                ) : (
                    <NotLogedIn page='your profile' heading= 'Profile' />
                )}
                <div className="z-10"><Footer /></div>
            </div>
        </>
    );
}

export default Profile;
