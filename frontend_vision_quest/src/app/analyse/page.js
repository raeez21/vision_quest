"use client"

import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../components/AuthContext";
import { SidebarMenu } from "../../../components/SidebarMenu";
import PrivateRoute from "../../../components/PrivateRoute";

export default function Page() {
  const { authToken } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    imageFile: null,
    algorithm: '',
    dataset: '',
    objects: '',
    objectConfThreshold: '',
    productConfThreshold: '',
  });
  const [datasetOptions, setDatasetOptions] = useState([]);
  const [analyseError, setAnalyseError] = useState('');
  
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === 'file' ? e.target.files[0] : value;

    if (name === 'algorithm') {
      if (value === 'ssd') {
        setDatasetOptions(['coco', 'other_dataset_1', 'other_dataset_2']);
      } else if (value === 'yolov7') {
        setDatasetOptions(['coco', 'voc', 'other_dataset']);
      } else if (value === 'f_rcnn') {
        setDatasetOptions(['voc', 'other_dataset']);
      }
    }

    setFormData((prevData) => ({ ...prevData, [name]: newValue }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    const formPayload = new FormData();
    formPayload.append('image', formData.imageFile);
    formPayload.append('type', 'image');
    formPayload.append('objects', formData.objects);
    formPayload.append('confThreshold', formData.objectConfThreshold);
    formPayload.append('nmsThreshold', formData.productConfThreshold);
    formPayload.append('model', formData.algorithm);
    formPayload.append('dataset', formData.dataset);
  
    try {
      const response = await fetch('http://127.0.0.1:8000/analyze/', {
        method: 'POST',
        headers: {
          Authorization: `Token ${authToken}`,
        },
        body: formPayload,
      });
  
      if (response.ok) {
        const data = await response.json();
        // Handle successful API response
        console.log(data); // Display response 
        
        // router.push('/results'); // Redirect to results page
      } else {
        // Handle API error 
        const data = await response.json();
        setAnalyseError(data.error)
        console.log(data); 
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
    }
  };
  
  return (
    <PrivateRoute>
      { authToken && 
          <div className='fixed ml-10 mt-28'>
              <SidebarMenu />
      </div> }
      <div className="flex flex-col justify-between">
        <Header />
        <main className="container mb-auto mx-auto mt-8">
          <form onSubmit={handleFormSubmit}>
            <div className="bg-gray-800 p-10 rounded-2xl text-center">
              <h2 className="text-3xl font-bold text-gray-400 mb-4">Analyse New Image</h2>
              <div className="mt-20 flex flex-col items-center justify-center">
                <div className="items-center flex w-76 h-48 bg-gray-600 rounded-xl">
                  <div className="mx-auto">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="ml-14 text-gray-400" 
                      name="imageFile"
                      onChange={handleInputChange}
                    />
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
                <label className="text-lg font-bold text-gray-700">Algorithm:</label>
                <select
                  className="ml-96 form-select"
                  name="algorithm"
                  value={formData.algorithm}
                  onChange={handleInputChange}
                >
                  <option value="">Select Algorithm</option>
                  <option value="yolov7">YOLO</option>
                  <option value="f_rcnn">Faster R-CNN</option>
                  <option value="ssd">SSD</option>
                </select>
              </div>

              {/* Dataset */}
              <div className="mt-10 flex space-y-2">
                <label className="text-lg font-bold text-gray-700">Dataset:</label>
                <select
                  className="ml-96 form-select"
                  name="dataset"
                  value={formData.dataset}
                  onChange={handleInputChange}
                >
                  <option value="">Select Dataset</option>
                  {datasetOptions.map((dataset) => (
                    <option key={dataset} value={dataset}>
                      {dataset}
                    </option>
                  ))}
                </select>
              </div>

              {/* Objects to Look For */}
              <div className="mt-10 flex space-y-2">
                <h4 className="text-lg font-bold text-gray-700">Objects to Look For:</h4>
                <input
                  type="text"
                  className="ml-72 form-input"
                  placeholder="Chairs, Cups, Computers"
                  name="objects"
                  value={formData.objects}
                  onChange={handleInputChange}
                />
              </div>
              {/* Object Detector Confidence Threshold */}
              <div className="mt-10 flex space-y-2">
                <h4 className="text-lg font-bold text-gray-700">Object Detector Confidence Threshold:</h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    className="ml-28 form-input w-16"
                    min="0"
                    max="1"
                    step="0.01"
                    name="objectConfThreshold"
                    value={formData.objectConfThreshold}
                    onChange={handleInputChange}
                  />
                  <span className="text-gray-400">Enter values between 0 and 1</span>
                </div>
              </div>
              {/* Product Detector Confidence Threshold */}
              <div className="mt-10 mb-12 flex space-y-2">
                <h4 className="text-lg font-bold text-gray-700">Object Detector NMS Threshold:</h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    className="ml-44 form-input w-16"
                    min="0"
                    max="1"
                    step="0.01"
                    name="productConfThreshold"
                    value={formData.productConfThreshold}
                    onChange={handleInputChange}
                  />
                  <span className="text-gray-400">Enter values between 0 and 1</span>
                </div>
              </div>
            </div>
            {analyseError && <div className="text-red-500 text-center mb-2">{analyseError}</div>}
            <div className="pb-10 text-center ">
              <button 
                className="hover:bg-slate-500 font-bold hover:text-slate-300 px-8 py-3 rounded bg-slate-300 text-slate-500"
                type="submit"
              >
                Analyse
              </button>
            </div>
          </form>
        </main>
        <Footer />
      </div>
    </PrivateRoute>
  )
}