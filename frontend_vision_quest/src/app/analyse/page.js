"use client"

import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../components/AuthContext";
import { SidebarMenu } from "../../../components/SidebarMenu";
import NotLogedIn from "../../../components/NotLogedIn";
import Webcam from "react-webcam";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

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
  const [objectOptions, setObjectOptions] = useState([]);
  const [analyseError, setAnalyseError] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [taskType, setTaskType] = useState('object');
  const [doRelated, setDoRelated] = useState(false);
  const [loading, setLoading] = useState(false);

  const ssdObjectList = ['person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light', 'fire hydrant', 'street sign', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'hat', 'backpack', 'umbrella', 'shoe', 'eye glasses', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket', 'bottle', 'plate', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch', 'potted plant', 'bed', 'mirror', 'dining table', 'window', 'desk', 'toilet', 'door', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'blender', 'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush', 'hair brush']
  const yolov7ObjectList = ['person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush']
  const frcnnObjectList = ['aeroplane', 'bicycle', 'bird', 'boat', 'bottle', 'bus', 'car', 'cat', 'chair', 'cow', 'diningtable', 'dog', 'horse', 'motorbike', 'person', 'pottedplant', 'sheep', 'sofa', 'train', 'tvmonitor'];

  const options = objectOptions.map(obj => ({ value: obj, label: obj }));
  const formattedSelectedObjects = selectedOption?.map(obj => obj.value).join(',');

  const handleCapture = () => {
    setCameraActive(true)
    
    // Capture an image after 4 seconds
    setTimeout(() => {
      const imageSrc = webcamRef.current.getScreenshot();
      const blob = dataURItoBlob(imageSrc)
      const capturedFile = new File([blob], 'captured_image.jpg', { type: 'image/jpeg' });
      setCapturedImage(capturedFile);
      setCameraActive(false);
    }, 5000)
  };
  
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === 'file' ? e.target.files[0] : value;

    if (name === 'algorithm') {
      if (value === 'ssd') {
        setDatasetOptions([{ value: 'coco', name: 'COCO'}]);
        setObjectOptions(ssdObjectList);
      } else if (value === 'yolov7') {
        setDatasetOptions([{ value: 'coco', name: 'COCO'}]);
        setObjectOptions(yolov7ObjectList);
      } else if (value === 'f_rcnn') {
        setDatasetOptions([{ value: 'voc', name: 'Pascal VOC'}]);
        setObjectOptions(frcnnObjectList);
      }
    }

    setFormData((prevData) => ({ ...prevData, [name]: newValue }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formPayload = new FormData();
    if (capturedImage) {
      formPayload.append('image', capturedImage);
    } else if (formData.imageFile) {
      formPayload.append('image', formData.imageFile);
    }
    formPayload.append('type', 'image');
    formPayload.append('objects', formattedSelectedObjects ? formattedSelectedObjects : '');
    formPayload.append('confThreshold', formData.objectConfThreshold);
    formPayload.append('nmsThreshold', formData.productConfThreshold);
    formPayload.append('model', formData.algorithm);
    formPayload.append('dataset', formData.dataset);
    formPayload.append('taskType', taskType);
    formPayload.append('doRelated', doRelated);

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
    setLoading(false);
  };
  
  // Function to convert data URI to Blob
  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  const toggleDoRelated = () => {
    setDoRelated(prevDoRelated => !prevDoRelated);
  };
  
  return (
    <>
      { authToken && <SidebarMenu />}
      <div className="flex flex-col justify-between">
        <Header />
        <main className="container mb-auto mx-auto mt-28 min-h-screen">
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
                        {formData.imageFile && (
                          <img 
                            src={URL.createObjectURL(formData.imageFile)} 
                            alt="Uploaded" 
                            className="mt-2 object-contain max-h-32 mx-auto"
                          />
                        )}
                      </div>
                    )}
                  </div>
                  {!cameraActive && (
                    <button 
                      className="mt-4 font-bold bg-slate-500 text-gray-900 px-4 py-2 rounded flex items-center"
                      onClick={handleCapture}
                    >
                      Use Camera
                    </button>
                  )}

                  {/* {cameraActive && (
                    <div className="mt-2 flex space-x-2">
                      <button
                        className="bg-slate-500 text-gray-900 px-4 py-2 rounded flex items-center"
                        onClick={handleCapture}
                      >
                        Capture Image
                      </button>
                    </div>
                  )} */}

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
                      <h4 className="text-lg font-bold text-gray-700">Task Type:</h4>
                      {taskType === 'object' && (
                        <>
                          <h4 className="mt-10 text-lg font-bold text-gray-700">Algorithm:</h4>
                          <h4 className="mt-10 text-lg font-bold text-gray-700">Dataset:</h4>
                          <h4 className="mt-12 text-lg font-bold text-gray-700">Objects to Look For:</h4>
                          <h4 className="mt-12 text-lg font-bold text-gray-700">Object Detector Confidence Threshold:</h4>
                          <h4 className="mt-10 text-lg font-bold text-gray-700">Object Detector NMS Threshold:</h4>
                          <h4 className="mt-10 text-lg font-bold text-gray-700">Do Related:</h4>

                        </>
                      )}
                      {taskType === 'product' && (
                        <>
                          <h4 className="mt-12 text-lg font-bold text-gray-700">Object Detector Confidence Threshold:</h4>
                          <h4 className="mt-10 text-lg font-bold text-gray-700">Object Detector NMS Threshold:</h4>
                          <h4 className="mt-10 text-lg font-bold text-gray-700">Do Related:</h4>
                        </>
                      )}
                    </div>
                    <div className="ml-12">
                      {/* Task type */}
                      <div className="flex space-y-2">
                        <select
                          required
                          name="taskType"
                          value={taskType}
                          onChange={(e) => setTaskType(e.target.value)}
                          className="bg-gray-200 rounded p-1"
                        >
                          <option value="">Select Task Type</option>
                          <option value="object">Object Detection</option>
                          <option value="product">Product Detection</option>
                        </select>
                      </div>
                      {taskType === 'object' && (
                        <>
                          {/* Algorithm */}
                          <div className="mt-10 flex space-y-2">
                            <select
                              required
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
                              required
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
                          <Select
                            isMulti
                            className=""
                            components={animatedComponents}
                            placeholder="Select objects"
                            defaultValue={selectedOption}
                            onChange={setSelectedOption}
                            options={options}
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
                          {/* Do related */}
                          <div className="mt-10 mb-12 flex space-y-2">
                            <div className="flex items-center space-x-2">
                              <div className="relative inline-block w-10 align-middle select-none">
                                <input
                                  type="checkbox"
                                  name="doRelated"
                                  id="doRelated"
                                  className="absolute opacity-0 w-0 h-0"
                                  checked={doRelated}
                                  onChange={toggleDoRelated}
                                />
                                <label
                                  htmlFor="doRelated"
                                  className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
                                    doRelated ? 'bg-purple-500' : 'bg-gray-400'
                                  }`}
                                ></label>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      {taskType === 'product' && (
                        <>
                          {/* Object Detector Confidence Threshold */}
                          <div className="mt-10 flex space-y-2">
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
                          {/* Do related */}
                          <div className="mt-10 mb-12 flex space-y-2">
                            <div className="flex items-center space-x-2">
                              <div className="relative inline-block w-10 align-middle select-none">
                                <input
                                  type="checkbox"
                                  name="doRelated"
                                  id="doRelated"
                                  className="absolute opacity-0 w-0 h-0"
                                  checked={doRelated}
                                  onChange={toggleDoRelated}
                                />
                                <label
                                  htmlFor="doRelated"
                                  className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
                                    doRelated ? 'bg-purple-500' : 'bg-gray-400'
                                  }`}
                                ></label>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
              </div>
              {analyseError && <div className="text-red-500 text-center mb-2">{analyseError}</div>}
              <div className="pb-10 text-center ">
                <button 
                  className="hover:bg-slate-500 font-bold hover:text-slate-300 px-8 py-3 rounded bg-slate-300 text-slate-500"
                  type="submit"
                >
                    {loading ? 'Analysing...' : 'Analyse'}
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