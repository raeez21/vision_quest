"use client"

import Link from "next/link";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { useAuth } from "../../components/AuthContext";
import { SidebarMenu } from "../../components/SidebarMenu";
import { Rating } from "@mui/material";

const testimonials = [
  {
    rating: 4,
    review:
      "Vision Quest is an effortlessly accurate object detection app. Whether it's identifying everyday items or pinpointing Nike shoe models, its precision is simply outstanding!",
    name: 'Alfie Solomons',
  },
  {
    rating: 3,
    review: 'Fast, accurate, and incredibly useful.',
    name: 'Freddy Thorne',
  },
  {
    rating: 3.5,
    review:
      "Its object detection capabilities are impressive, and the Nike shoe detector is spot on. As a sneaker enthusiast, I highly recommend this!!",
    name: 'Ajay Jose',
  },
];


export default function Page() {
  const { authToken } = useAuth()
  return (
    <>
      { authToken && <div className="fixed"><SidebarMenu /></div>}
      <div className="flex flex-col h-screen justify-between">
        <Header />
        <main className="container mb-auto mx-auto mt-28">
          <div className="flex items-center mb-8 bg-gray-800 p-10 rounded-lg space-x-4 " style={{ backgroundImage: 'url(https://universe.roboflow.com/images/newbanner.webp)', backgroundPosition: '50%' , backgroundSize: 'cover' }}>
            <div className="flex-1">
            <h2 className="text-4xl font-bold font-Poppins bg-clip-text text-transparent" 
              style={{
                backgroundImage: 'linear-gradient(to right, #8315f9, #00ffce)',
                color: 'transparent',
                backgroundClip: 'text',
                textShadow: 'var(--tw-drop-shadow)'
              }}
            >Explore Vision Quest!</h2>
              <p className="text-gray-400 mt-2">
                Explore, Detect and Discover products with our Cutting-Edge Visionary Web App!
                Simply upload an image of any product, and our advanced algorithms will swiftly identify its category, enabling you to explore a world of possibilities. From basic object recognition to advanced product matching, our user-friendly interface effortlessly connects you with the items you desire. Elevate your shopping journey with our revolutionary web app, and embark on a visual quest like never before!
              </p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              { authToken ?
                (<Link href="/analyse" className="font-semibold hover:font-normal text-sm leading-7 shadow-md px-4 py-2 rounded bg-white text-purple-700 hover:bg-purple-700 hover:text-white transition duration-300"
                // style={{
                //   color: 'rgba(103, 6, 206, 1)',
                //   backgroundColor: 'rgba(255, 255, 255, 1)'
                // }}
              >
                  Analyse Now
                </Link>) : 
                (<Link href="/signin" className="font-semibold hover:font-normal text-sm leading-7 shadow-md px-4 py-2 rounded bg-white text-purple-700 hover:bg-purple-700 hover:text-white transition duration-300"
                  // style={{
                  //   color: 'rgba(103, 6, 206, 1)',
                  //   backgroundColor: 'rgba(255, 255, 255, 1)'
                  // }}
                >
                  Try Now
                </Link>)}
            </div>
          </div>
          <section 
            className="mt-20 rounded-md shadow-2xl bg-gray-800 opacity-100 transition duration-300 p-12"
            style={{
                backgroundImage: 'linear-gradient(rgba(17,24,39,0.5), rgba(17,24,39,0.5)), url(https://app.roboflow.com/images/flow.png)',
                // backgroundPosition: 'center',
                backgroundSize: 'cover',
                // backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="container mx-auto text-center">
              <h2 className="text-3xl font-semibold mb-6 ">What Our Users Say!</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="rounded-md flex flex-col justify-center text-center shadow-2xl p-6 opacity-70 hover:opacity-100  transition duration-300"
                    style={{
                      backgroundImage: 'url(https://app.roboflow.com/images/flow.png)',
                      // backgroundPosition: 'center',
                      // backgroundSize: 'cover',
                      // backgroundRepeat: 'no-repeat',
                  }}
                  >
                    <p className="text-gray-100 font-sans mb-4">" {testimonial.review} "</p>
                    <div><Rating name="half-rating-read" value={testimonial.rating} readOnly /></div>
                    <p className="text-purple-300 text-lg font-bold">
                      - {testimonial.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </main>
        <div className="z-10"><Footer /></div>
      </div>

    </>
  )
}