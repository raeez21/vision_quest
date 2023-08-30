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
        <div className="flex flex-col justify-between">
            <Header />
            { authToken ? (
                <main className="container  mb-auto mx-auto min-h-screen mt-28">
                    <h2 className="text-3xl font-semibold mb-4">Results</h2>
                    <div className="flex flex-row justify-center">
                        <div className="max-w-4xl p-6 border border-gray-800 rounded-lg shadow-md">
                            <img src={results.media?.output_image_path} alt="Uploaded" className="w-full rounded-lg" />
                            <ImageDetails name={results.media?.image_name} size={results.media?.image_size} />
                        </div>
                    </div>
                    <div className="flex justify-around mt-28">
                        <div className="p-6 border bg-gray-400 rounded-lg shadow-md">
                            <div className="p-6 border border-gray-300 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold mb-4">Analysis Options Used:</h3>
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
                        {results.options?.taskType === 'object' && (
                            <div className="p-6 border bg-gray-400 rounded-lg shadow-md">
                                <ObjectDetectorResults results={results.prediction_results} />
                            </div>
                        )}
                        {results.options?.taskType === 'product' && (
                            <div className="p-6 border bg-gray-400 rounded-lg shadow-md">
                                <ProductDetectorResults results={results.prediction_results} />
                            </div>
                        )}
                    </div>

                    <div className="mb-14 mt-24">
                        <h2 className="text-3xl font-semibold mb-4">Related Products</h2>
                        <div className="flex flex-wrap justify-between mt-10 space-y-4 md:space-y-0 md:space-x-4">
                            {results.related_results?.map((product, index) => (
                                <div
                                    key={index}
                                    className="flex-none w-full md:w-1/3 lg:w-1/6 h-48 bg-gray-300 rounded-xl relative"
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