import Link from "next/link";
import Header from "../../../components/Header";

export default function Page() {
    return (
      <>
        <div>
          <Header />
          <main className="container mx-auto mt-8">
            <div className="flex items-center mb-8 bg-gray-800 p-10 rounded-2xl space-x-4 ">
              <div className="flex-1">
                <h2 className="text-4xl font-bold text-gray-600 font-Poppins">Vision Quest</h2>
                <p className="text-gray-600 mt-2">
                  Explore, Detect and Discover products with our Cutting-Edge Visionary Web App!
                  Simply upload an image of any product, and our advanced algorithms will swiftly identify its category, enabling you to explore a world of possibilities. From basic object recognition to advanced product matching, our user-friendly interface effortlessly connects you with the items you desire. Elevate your shopping journey with our revolutionary web app, and embark on a visual quest like never before!
                </p>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <button className="font-bold bg-slate-500 text-slate-900 px-4 py-2 rounded">
                  Try Now
                </button>
              </div>
            </div>
            {/* Rest of your home page content */}
          </main>
        </div>

      </>
    )
  }