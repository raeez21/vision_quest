"use client"

import Link from "next/link";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { useAuth } from "../../components/AuthContext";
import { SidebarMenu } from "../../components/SidebarMenu";


const reviewImages = [
  'image_url_1.jpg',
  'image_url_2.jpg',
  'image_url_3.jpg',
  'image_url_4.jpg',
  'image_url_5.jpg',
];

export default function Page() {
  const { authToken } = useAuth()
  return (
    <>
      { authToken && <div className="fixed"><SidebarMenu /></div>}
      <div className="flex flex-col h-screen justify-between">
        <Header />
        <main className="container mb-auto mx-auto mt-28">
          <div className="flex items-center mb-8 bg-gray-800 p-10 rounded-2xl space-x-4 ">
            <div className="flex-1">
              <h2 className="text-4xl font-bold text-gray-400 font-Poppins">Vision Quest</h2>
              <p className="text-gray-400 mt-2">
                Explore, Detect and Discover products with our Cutting-Edge Visionary Web App!
                Simply upload an image of any product, and our advanced algorithms will swiftly identify its category, enabling you to explore a world of possibilities. From basic object recognition to advanced product matching, our user-friendly interface effortlessly connects you with the items you desire. Elevate your shopping journey with our revolutionary web app, and embark on a visual quest like never before!
              </p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              { authToken ?
                (<Link href="/analyse" className="font-bold bg-slate-300 text-slate-700 px-4 py-2 rounded hover:bg-slate-500 hover:text-slate-300">
                  Analyse Now
                </Link>) : 
                (<Link href="/signin" className="font-bold bg-slate-300 text-slate-700 px-4 py-2 rounded hover:bg-slate-500 hover:text-slate-300">
                  Try Now
                </Link>)}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-semibold mb-4">Reviews</h2>
            <div className="flex space-x-4 justify-between">
              {reviewImages.map((imageUrl, index) => (
                <div
                  key={index}
                  className="flex-none w-56 h-48 bg-gray-300 rounded-xl"
                  style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover' }}
                ></div>
              ))}
            </div>
          </div>

        </main>
        <div className="z-10"><Footer /></div>
      </div>

    </>
  )
}