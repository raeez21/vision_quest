"use client"

import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../components/AuthContext";
import { SidebarMenu } from "../../../components/SidebarMenu";
import NotLogedIn from "../../../components/NotLogedIn";
import Webcam from "react-webcam";

export default function Page() {
  const { authToken } = useAuth();
  const router = useRouter();
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);

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

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setCameraActive(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === 'file' ? e.target.files[0] : value;

    if (name === 'algorithm') {
      if (value === 'ssd') {
        setDatasetOptions([{ value: 'coco', name: 'COCO'}]);
      } else if (value === 'yolov7') {
        setDatasetOptions([{ value: 'coco', name: 'COCO'}]);
      } else if (value === 'f_rcnn') {
        setDatasetOptions([{ value: 'voc', name: 'Pascal VOC'}]);
      }
    }

    setFormData((prevData) => ({ ...prevData, [name]: newValue }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    const formPayload = new FormData();
    if (capturedImage) {
      formPayload.append('image', capturedImage);
    } else if (formData.imageFile) {
      formPayload.append('image', formData.imageFile);
    }
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
        // console.log(data); // Display response 
        const job_id = data.job_id;
        router.push(`/results?job_id=${job_id}`); // Redirect to results page
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
    <>
      { authToken && <SidebarMenu />}
      <div className="flex flex-col justify-between">
        <Header />
        <main className="container mb-auto mx-auto mt-28">
          { authToken ? (
            <form onSubmit={handleFormSubmit}>
              <div className="bg-gray-800 p-10 rounded-2xl text-center">
                <h2 className="text-3xl font-bold text-gray-400 mb-4">Analyse New Image</h2>
                <div className="mt-20 flex flex-col items-center justify-center">
                  <div className="items-center flex w-76 h-48 bg-gray-600 rounded-xl">
                    {cameraActive ? (
                      <Webcam
                        ref={webcamRef}
                        mirrored={true} // Mirror the camera view
                        screenshotFormat="image/jpeg"
                        videoConstraints={{
                          facingMode: 'environment', // Use the rear camera
                        }}
                        className="object-cover h-full w-full"
                      />
                    ) : (
                      <div className="mx-auto">
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="ml-14 text-gray-400" 
                          name="imageFile"
                          onChange={handleInputChange}
                        />
                      </div>
                    )}
                  </div>
                  {!cameraActive && (
                    <button 
                      className="mt-4 font-bold bg-slate-500 text-gray-900 px-4 py-2 rounded flex items-center"
                      onClick={() => setCameraActive(true)}
                    >
                      Use Camera
                    </button>
                  )}

                  {cameraActive && (
                    <div className="mt-2 flex space-x-2">
                      <button
                        className="bg-slate-500 text-gray-900 px-4 py-2 rounded flex items-center"
                        onClick={handleCapture}
                      >
                        Capture Image
                      </button>
                    </div>
                  )}

                  {capturedImage && (
                    <div className="mt-4 flex">
                      <img
                        src={capturedImage}
                        alt="Captured"
                        style={{ width: '100px', height: '100px' }}
                        className=""
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 text-left">
                <h2 className="text-3xl font-semibold mb-4 text-gray-800">Settings</h2>
                  <div className="flex flex-row">
                    <div>
                      <h4 className="text-lg font-bold text-gray-700">Algorithm:</h4>
                      <h4 className="mt-10 text-lg font-bold text-gray-700">Dataset:</h4>
                      <h4 className="mt-10 text-lg font-bold text-gray-700">Objects to Look For:</h4>
                      <h4 className="mt-10 text-lg font-bold text-gray-700">Object Detector Confidence Threshold:</h4>
                      <h4 className="mt-10 text-lg font-bold text-gray-700">Object Detector NMS Threshold:</h4>
                    </div>
                    <div className="ml-12">
                      {/* Algorithm */}
                      <div className="flex space-y-2">
                        <select
                          className="form-select"
                          name="algorithm"
                          value={formData.algorithm}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Algorithm</option>
                          <option value="yolov7">YOLOV7</option>
                          <option value="f_rcnn">Faster R-CNN</option>
                          <option value="ssd">SSD</option>
                        </select>
                      </div>

                      {/* Dataset */}
                      <div className="mt-10 flex space-y-2">
                        <select
                          className="form-select"
                          name="dataset"
                          value={formData.dataset}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Dataset</option>
                          {datasetOptions.map((dataset) => (
                            <option key={dataset.value} value={dataset.value}>
                              {dataset.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Objects to Look For */}
                      <div className="mt-12 flex space-y-2">
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Chairs, Cups, Computers"
                          name="objects"
                          value={formData.objects}
                          onChange={handleInputChange}
                        />
                      </div>
                      {/* Object Detector Confidence Threshold */}
                      <div className="mt-12 flex space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            className="form-input w-16"
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
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            className="form-input w-16"
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
            ) : (
            <NotLogedIn page='analyse page' heading= 'Analyse' />
          )}
        </main>
        <div className="z-10"><Footer /></div>
      </div>
    </>
  )
}