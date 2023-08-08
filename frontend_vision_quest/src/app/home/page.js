import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const reviewImages = [
  'image_url_1.jpg',
  'image_url_2.jpg',
  'image_url_3.jpg',
  'image_url_4.jpg',
  'image_url_5.jpg',
];

export default function Page() {
    return (
      <>
        <div className="flex flex-col h-screen justify-between">
          <Header />
          <main className="container mb-auto mx-auto mt-8">
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

            <div className="mb-8">
              <h2 className="text-3xl font-semibold mb-4">Reviews</h2>
              <div className="flex space-x-4 justify-between">
                <div>
                  
                </div>
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
          <Footer />
        </div>

      </>
    )
  }