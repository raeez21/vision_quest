'use client'

import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { ImageDetails, ObjectDetectorResults } from "../../../components/ObjectDectectorResults";
import { ProductDetectorResults } from "../../../components/ProductDetectorResults";
import { SidebarMenu } from "../../../components/SidebarMenu";
import { useAuth } from "../../../components/AuthContext";
import NotLogedIn from "../../../components/NotLogedIn";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Page() {
    const { authToken } = useAuth()
    const router = useSearchParams();
    const job_id = router.get('job_id') 

    const [results, setResults] = useState([]);

    useEffect(() => {
        if (job_id && authToken) {
            const fetchResults = async () => {
                try {
                    const response = await fetch(`http://127.0.0.1:8000/results/?job_id=${job_id}`,{
                        method: 'GET',
                        headers: {
                            Authorization: `Token ${authToken}`,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        // console.log(data); // Display response 
                        setResults(data);
                        
                    } else {
                        // API error 
                        const data = await response.json();
                        // setAnalyseError(data.error)
                        console.log(data); 
                    }
                } catch (error) {
                    console.error('Error fetching results:', error);
                }
            };
            fetchResults();
        }
    },  [job_id, authToken]);

    // if (!authToken) {
    //     return <NotLogedIn page="results page" heading="Results" />;
    // }

    // if (!results) {
    //     return <div>Loading...</div>; // Display a loading state while fetching results
    // }

    return (
      <>
        { authToken && <SidebarMenu />}
        <div className="flex flex-col justify-between"
            // style={{
            //     backgroundImage: 'linear-gradient(rgba(17,24,39,0.5), rgba(17,24,39,0.5)), url(https://app.roboflow.com/images/flow.png)',
            //     backgroundPosition: 'center',
            //     backgroundSize: 'cover',
            //     backgroundRepeat: 'no-repeat',
            // }}
        >
            <Header />
            { authToken ? (
                <main className="container  mb-auto mx-auto min-h-screen mt-28">
                    <h2 className="text-3xl font-semibold mb-4">Results</h2>
                    <div className="rounded-md shadow-2xl bg-gray-800 opacity-100 transition duration-300 p-10 text-center">
                        <div className="flex flex-row items-center justify-center">
                            <div className="flex flex-row justify-center">
                                <div className="flex justify-center w-1/3 mr-10 p-6 text-center rounded-md shadow-2xl bg-gray-900 opacity-80 hover:opacity-100 transition duration-300">
                                    <div className="p-6 border border-gray-300 rounded-md shadow-md">
                                        <h3 className="text-xl font-semibold mb-4">Analysis Settings:</h3>
                                        <ul className="list-disc pl-6">
                                            <li className="mb-4">
                                                <span className="font-bold mr-4">Task Type:</span> {results.options?.taskType}
                                            </li>
                                            <li className="mb-4">
                                                <span className="font-bold mr-4">Algorithm:</span> {results.options?.model}
                                            </li>
                                            <li className="mb-4">
                                                <span className="font-bold mr-4">Dataset:</span> {results.options?.dataset}
                                            </li>
                                            <li className="mb-4">
                                                <span className="font-bold mr-4">Objects to Look For:</span> {results.options?.objects?.join(', ')}
                                            </li>
                                            <li className="mb-4">
                                                <span className="font-bold mr-4">Confidence Threshold:</span> {results.options?.ConfidenceThreshold}
                                            </li>
                                            <li className="mb-4">
                                                <span className="font-bold mr-4">NMS Threshold:</span> {results.options?.NmsThreshold}
                                            </li>
                                            {/* <li className="mb-4">
                                                <span className="font-bold">Do Related:</span> {results.options?.doRelated}
                                            </li> */}

                                        </ul>
                                    </div>
                                </div>
                                <div className="w-2/3 p-5 items-center flex flex-col rounded-md shadow-2xl bg-gray-900 opacity-80 hover:opacity-100 transition duration-300">
                                    <img src={results.media?.output_image_path} alt="Uploaded" className="w-full rounded-md" />
                                    <ImageDetails name={results.media?.image_name} size={results.media?.image_size} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 rounded-md shadow-2xl bg-gray-800 opacity-100 transition duration-300 p-10 text-center">
                        <div className="flex justify-around">
                            {results.options?.taskType === 'object' && (
                                <div className="p-6  rounded-md shadow-2xl bg-gray-900 opacity-80 hover:opacity-100 transition duration-300">
                                    <ObjectDetectorResults results={results.prediction_results} />
                                </div>
                            )}
                            {results.options?.taskType === 'product' && (
                                <div className="p-6  rounded-md shadow-2xl bg-gray-900 opacity-80 hover:opacity-100 transition duration-300">
                                    <ProductDetectorResults results={results.prediction_results} />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mb-14 mt-24">
                        <h2 className="text-3xl font-semibold mb-4">Related Products</h2>
                        <div className="flex flex-wrap justify-between mt-10 space-y-4 md:space-y-0 md:space-x-4">
                            {results.related_results?.map((product, index) => (
                                <div
                                    key={index}
                                    className="flex-none w-full md:w-1/3 lg:w-1/6 h-48  rounded-md shadow-2xl bg-gray-900 opacity-80 hover:opacity-100 transition duration-300 relative"
                                >
                                    <Link
                                        href={product.link}
                                        target="_blank"
                                        className="absolute inset-0"
                                    ></Link>
                                    <div
                                        className="h-full"
                                        style={{
                                            backgroundImage: `url(${product.image_link})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                    ></div>
                                    <p className="absolute bottom-0 left-0 right-0 px-2 py-1 text-white bg-black bg-opacity-70 text-sm truncate">
                                        {product.title}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            ) : (
                <NotLogedIn page='results page' heading='Results' />
            )}
            <div className="z-10"><Footer /></div>
        </div>

      </>
    )
  }