"use client"

import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { SidebarMenu } from "../../../components/SidebarMenu";
import { useAuth } from "../../../components/AuthContext";
import { useEffect, useState } from "react";
import NotLogedIn from "../../../components/NotLogedIn";
// import { useEffect, useRef } from "react";
// import Chart from 'chart.js/auto';

export default function Page() {
    const { authToken } = useAuth()

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                const response = await fetch('http://127.0.0.1:8000/dashboard/', {
                    method: 'GET',
                    headers: {
                        Authorization: `Token ${authToken}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setDashboardData(data);
                } else {
                    // Handle API error
                    console.log('Error fetching dashboard data:', response);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, [authToken]);

    // const chartRef = useRef(null);

    // const usageData = {
    //   labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    //   datasets: [
    //     {
    //       label: 'Images Analyzed',
    //       data: [12, 18, 10, 6, 9, 15, 20],
    //       backgroundColor: 'rgba(75, 192, 192, 0.2)',
    //       borderColor: 'rgba(75, 192, 192, 1)',
    //       borderWidth: 1,
    //     },
    //   ],
    // };
  
    // useEffect(() => {
    //   const ctx = chartRef.current.getContext('2d');
  
    //   new Chart(ctx, {
    //     type: 'line',
    //     data: usageData,
    //   });
    // }, []);

    return (
      <>
        { authToken && 
            <div className='fixed ml-10 mt-28'>
                <SidebarMenu />
        </div> }
        <div className="flex flex-col justify-between">
            <Header />
            { authToken ? (
                <main className="container mb-auto mx-auto mt-8">
                    <h2 className="text-3xl font-semibold mb-4">Dashboard</h2>
                    <div className="mb-8">
                        <div className="flex flex-row justify-end items-center space-x-10">
                            <span className="text-gray-700">Sort by:</span>
                            <div>
                                <label className="flex items-center space-x-2">
                                    <input type="radio" name="sort" value="date" className="form-radio" />
                                    <span>Date</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input type="radio" name="sort" value="name" className="form-radio" />
                                    <span>Name</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input type="radio" name="sort" value="size" className="form-radio" />
                                    <span>Size</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    {loading ? (
                        <p>Loading...</p>
                        ) : (
                        <div className="mb-8">
                            <div className="pt-4 flex flex-col items-start space-y-6">
                                {/* <h3 className="text-2xl font-semibold mb-2">Last Week</h3> */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {dashboardData?.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col items-center bg-white p-4 rounded-xl shadow-md"
                                        >
                                            <img
                                                className="flex-none w-48 h-32 md:w-56 md:h-48 bg-gray-300 rounded-xl mb-2"
                                                alt={item.image_name}
                                                src={`${item.output_image_path}`}
                                            ></img>
                                            <p className="mt-2 text-sm">Name: {item.image_name}</p>
                                            <p className="text-sm">Timestamp: {item.timestamp}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-8 mt-10">
                                <h2 className="text-3xl font-semibold mb-4">Usage Analytics</h2>
                                <div className="bg-white h-64 w-96 p-4 rounded-lg shadow-md">
                                    {/* <canvas ref={chartRef} width={400} height={200}></canvas> */}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            ) : (
                <NotLogedIn page='your dashboard' heading= 'Dashboard' />
            )}
            <Footer />
        </div>

      </>
    )
  }