"use client"

import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { SidebarMenu } from "../../../components/SidebarMenu";
import { useAuth } from "../../../components/AuthContext";
import { useEffect, useState } from "react";
import NotLogedIn from "../../../components/NotLogedIn";
import Link from "next/link";
import "chart.js/auto";
import { Doughnut, Line } from "react-chartjs-2";

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

    const dates = dashboardData?.analytics.graph_data.map(item => item.date);
    const counts = dashboardData?.analytics.graph_data.map(item => item.count);
  
    // Create the chart data
    const chartData = {
        labels: dates,
        datasets: [
            {
            label: 'Count',
            data: counts,
            fill: false,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            },
        ],
    };

    const doughnutChartData = {
        labels: ['Jobs Performed', 'Average Daily Jobs', 'Max Jobs in a Day'],
        datasets: [
            {
                data: [dashboardData?.analytics.jobs_performed, dashboardData?.analytics.average_daily_jobs, dashboardData?.analytics.max_jobs_in_day],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            },
        ],
    };
    
    const isNewUser = dashboardData?.jobs?.length === 0;

    return (
      <>
        { authToken && <SidebarMenu />}
        <div className="flex flex-col justify-between">
            <Header />
            { authToken ? (
                <main className="container mb-auto mx-auto mt-28 min-h-screen">
                    <h2 className="text-3xl font-semibold mb-4">Dashboard</h2>
                    <div className="mb-8">
                        <div className="flex flex-row justify-end items-center space-x-10">
                            <span className="">Sort by:</span>
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
                            <div className="flex items-center justify-center h-48">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-700"></div>
                            </div>
                        ) : (
                        <div className="mb-8">
                            <div className="flex justify-center items-center">
                                <div className="flex flex-col items-start space-y-6">
                                    {/* <h3 className="text-2xl font-semibold mb-2">Last Week</h3> */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {isNewUser && 
                                            // Show dashboard skeleton for new users
                                            <div className="p-6 rounded-md shadow-2xl bg-gray-800 opacity-80 hover:opacity-100 transition duration-300">
                                                <h2 className="text-xl font-bold mb-4">Nothing to show here yet.</h2>
                                                <h3 className="text-lg">
                                                        Go to {' '}
                                                    <Link href="/analyse" className="mr-2 font-bold leading-6 text-purple-700 opacity-80 hover:opacity-100 transition duration-300">
                                                        analyse
                                                    </Link>page!!.
                                                </h3>
                                            </div>
                                        }
                                        {dashboardData?.jobs.map((item, index) => (
                                            <Link
                                                href={`/results/?job_id=${item[' job_id']}`}
                                                key={index}
                                                className="flex flex-col items-center p-4 rounded-md shadow-2xl bg-gray-800 opacity-70 hover:opacity-100 hover:bg-gray-800 transition duration-300"
                                            >
                                                <img
                                                    className="flex-none w-48 h-32 md:w-56 md:h-48 bg-gray-600 shadow-2xl rounded-md mb-2"
                                                    alt={item.image_name}
                                                    src={item.output_image_path}
                                                ></img>
                                                <p className="mt-2 text-sm font-semibold text-center">Name: {item.image_name}</p>
                                                <p className="mt-1 text-sm">Timestamp: {item.timestamp}</p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="mb-8 mt-16">
                                <h2 className="text-3xl font-semibold mb-4">Usage Analytics</h2>
                                <div className="container mx-auto p-4 flex flex-wrap">
                                    <div className="w-full md:w-1/2 p-2">
                                        <div className="bg-white rounded-lg shadow-md p-4 opacity-80 hover:opacity-100 transition duration-300">
                                            <Line data={chartData} options={{ maintainAspectRatio: false }} />
                                        </div>
                                    </div>
                                    <div className="w-full md:w-1/2 p-2">
                                        <div className="bg-white rounded-lg shadow-md p-4 opacity-80 hover:opacity-100 transition duration-300">
                                            <Doughnut data={doughnutChartData} options={{ maintainAspectRatio: false }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            ) : (
                <NotLogedIn page='your dashboard' heading= 'Dashboard' />
            )}
            <div className="z-10"><Footer /></div>
        </div>

      </>
    )
  }