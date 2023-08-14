import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Link from "next/link";

export default function Page() {
    return (
      <>
        <div className="flex flex-col justify-between">
            <Header />
            <main className="container mb-auto mx-auto mt-8">
              <div className="bg-gray-800 p-10 rounded-2xl text-center">
                <h2 className="text-3xl font-bold text-gray-400 mb-4">Analyse New Image</h2>
                <div className="mt-20 flex flex-col items-center justify-center">
                  <div className="items-center flex w-76 h-48 bg-gray-600 rounded-xl">
                    <div className="mx-auto">
                      <input type="file" accept="image/*" className="ml-14 text-gray-400" />
                    </div>
                  </div>
                  <button className="mt-16 font-bold bg-slate-500 text-gray-900 px-4 py-2 rounded flex items-center">
                    Upload Image
                  </button>
                </div>
              </div>

              <div className="mt-8 text-left">
                <h2 className="text-3xl font-semibold mb-4 text-gray-800">Settings</h2>
                {/* Algorithm */}
                <div className="flex space-y-2">
                  <h4 className="text-lg font-bold text-gray-700">Algorithm:</h4>
                  <div className="ml-96">
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="algorithm" value="CASCADE CLASSIFIER" className="form-radio" />
                      <span>CASCADE CLASSIFIER</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="algorithm" value="YOLO" className="form-radio" />
                      <span>YOLO</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="algorithm" value="Faster R-CNN" className="form-radio" />
                      <span>Faster R-CNN</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="algorithm" value="SSD" className="form-radio" />
                      <span>SSD</span>
                    </label>
                  </div>
                </div>
                {/* Objects to Look For */}
                <div className="mt-10 flex space-y-2">
                  <h4 className="text-lg font-bold text-gray-700">Objects to Look For:</h4>
                  <input type="text" className="ml-72 form-input" placeholder=" Chairs, Cups, Computers" />
                </div>
                {/* Object Detector Confidence Threshold */}
                <div className="mt-10 flex space-y-2">
                  <h4 className="text-lg font-bold text-gray-700">Object Detector Confidence Threshold:</h4>
                  <div className="flex items-center space-x-2">
                    <input type="number" className="ml-28 form-input w-16" min="0" max="100" />
                    <span>%</span>
                  </div>
                </div>
                {/* Product Detector Confidence Threshold */}
                <div className="mt-10 mb-12 flex space-y-2">
                  <h4 className="text-lg font-bold text-gray-700">Product Detector Confidence Threshold:</h4>
                  <div className="flex items-center space-x-2">
                    <input type="number" className="ml-24 form-input w-16" min="0" max="100" />
                    <span>%</span>
                  </div>
                </div>
              </div>
              <div className="mb-8 ml-96 items-center">
                <Link 
                  className="bg-slate-500 font-bold text-gray-900 px-8 py-3 rounded"
                  href="/results">
                  GO
                </Link>
              </div>
            </main>
            <Footer />
        </div>

      </>
    )
  }