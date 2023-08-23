'use client'

import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { ImageDetails, ObjectDetectorResults } from "../../../components/ObjectDectectorResults";
import { ProductDetectorResults } from "../../../components/ProductDetectorResults";
import { SidebarMenu } from "../../../components/SidebarMenu";
import { useAuth } from "../../../components/AuthContext";
import PrivateRoute from "../../../components/PrivateRoute";

const imageDetails = {
    name: 'image.jpg',
    size: '2.5 MB',
};
  
const objectDetectorResults = [
    { object: 'Chair', confidence: 62, remarks: 'Particluar chair identified' },
    { object: 'Spectacles', confidence: 70, remarks: '' },
    { object: 'Human', confidence: 84, remarks: '' },
    { object: 'Cup', confidence: 65, remarks: '' },
    { object: 'Mouse', confidence: 73, remarks: '' },
    { object: 'Running Shoes', confidence: 78, remarks: 'Shoes identified' },
];

const productDetectorResults = [
    { productName: 'Product Name 1', confidence: 68, brandName: 'Ikea', pricing: '$159', link: 'ikea.com' },
    { productName: 'Product Name 1', confidence: 55, brandName: '', pricing: '', link: '' },
    { productName: 'Product Name 1', confidence: 77, brandName: 'Puma', pricing: '$50', link: 'puma.com' },
];

const relatedProducts = [
    'image_url_1.jpg',
    'image_url_2.jpg',
    'image_url_3.jpg',
    'image_url_4.jpg',
    'image_url_5.jpg',
];

export default function Page() {
    const { authToken } = useAuth()

    return (
      <PrivateRoute>
        { authToken && 
            <div className='fixed ml-10 mt-28'>
                <SidebarMenu />
        </div> }
        <div className="flex flex-col justify-between">
            <Header />
            <main className="container  mb-auto mx-auto mt-8">
                <div className="max-w-lg p-6 border border-gray-800 rounded-lg shadow-md">
                    <img src="/path/to/uploaded/image.jpg" alt="Uploaded" className="w-full rounded-lg" />
                    <ImageDetails name={imageDetails.name} size={imageDetails.size} />
                </div>
                <div className="flex justify-around mt-28">
                    <div className="p-6 border bg-gray-400 rounded-lg shadow-md">
                        <ObjectDetectorResults results={objectDetectorResults} />
                    </div>
                    <div className="p-6 border bg-gray-400 rounded-lg shadow-md">
                        <ProductDetectorResults results={productDetectorResults} />
                    </div>
                </div>

                <div className="mb-14 mt-24">
                    <h2 className="text-3xl font-semibold mb-4">Related Products</h2>
                    <div className="flex space-x-4 justify-between mt-10">
                        {relatedProducts.map((imageUrl, index) => (
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

      </PrivateRoute>
    )
  }