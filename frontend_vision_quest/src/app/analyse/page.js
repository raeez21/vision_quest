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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faUpload } from '@fortawesome/free-solid-svg-icons';

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
    if (taskType !== 'product' && (!formData.algorithm || !formData.dataset)) {
      // Display message to select the required settings first.
      alert('Please select the required settings first.');
      return;
    }
  
    // Ask for camera access
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => {
        // Camera access granted, activate the camera
        setCameraActive(true);
  
        // Capture an image after 4 seconds
        setTimeout(async () => {
          const imageSrc = webcamRef.current?.getScreenshot();
          const blob = dataURItoBlob(imageSrc);
          const capturedFile = new File([blob], 'captured_image.jpg', { type: 'image/jpeg' });
          setCapturedImage(capturedFile);
          setCameraActive(false);
  
          // Call the analysis function after capturing the image
          await handleFormSubmit(null, capturedFile);
        }, 5000);
      })
      .catch((error) => {
        // Handle camera access denied
        console.error('Camera access error:', error);
      });
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

  const handleFormSubmit = async (e,capturedFile) => {
    if (e) {
      e.preventDefault();
    }
    setLoading(true);

    const formPayload = new FormData();
    if (capturedFile) {
      formPayload.append('image', capturedFile);
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
              <h2 className="text-center text-3xl font-bold mb-10">Analyse New Image</h2>
              <div className="rounded-md shadow-2xl bg-gray-800 opacity-100 transition duration-300 p-10 text-center">
                <div className="flex flex-row items-center justify-center">
                  <div className="w-1/2 mr-10 flex flex-col">
                    <div 
                      className="items-center flex w-auto rounded-md shadow-2xl bg-gray-900 opacity-80 hover:opacity-100 transition duration-300"
                      style={{
                        height: '481px',
                        backgroundImage: 'linear-gradient(rgba(17,24,39,0.5), rgba(17,24,39,0.5)), url(https://universe.roboflow.com/images/rfWidget_universe_empty.webp)',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                      }}
                    >
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
                          {formData.imageFile && (
                            <img 
                              src={URL.createObjectURL(formData.imageFile)} 
                              alt="Uploaded" 
                              className="mt-2 object-contain mx-auto rounded-md p-4"
                            />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mt-4 p-5 rounded-md shadow-2xl bg-gray-900 opacity-80 hover:opacity-100 transition duration-300">
                      <label htmlFor="fileInput" className="cursor-pointer">
                        <span className="mr-2 px-4 py-2 rounded shadow-md bg-white text-purple-700 hover:bg-purple-700 hover:text-white transition duration-300">
                          <FontAwesomeIcon icon={faUpload} className="mr-1" />
                          Choose Image
                        </span>
                        <input
                          id="fileInput"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          name="imageFile"
                          onChange={handleInputChange}
                        />
                      </label>
                      {/* {!cameraActive && ( */}
                        <button 
                          className="ml-2 px-4 py-2 rounded-md shadow-md bg-white text-purple-700 hover:bg-purple-700 hover:text-white transition duration-300"
                          onClick={handleCapture}
                        >
                          <FontAwesomeIcon icon={faCamera} className="mr-1" />
                          Use Camera
                        </button>
                      {/* )} */}
                    </div>
                  </div>
                  <div 
                    className="p-1 pt-4 w-1/2 text-center rounded-md shadow-2xl bg-gray-900 opacity-80 hover:opacity-100 transition duration-300"
                    style={{
                      height: '577px',
                    }}
                  >
                    <h2 className="text-3xl font-semibold mb-4 ">Settings</h2>
                      <div className="flex flex-row">
                        <div>
                          <h4 className="text-lg font-bold">Task Type:<span className="text-red-500 text-sm">*</span></h4>
                          {taskType === 'object' && (
                            <>
                              <h4 className="mt-10 text-lg font-bold">Algorithm:<span className="text-red-500 text-sm">*</span></h4>
                              <h4 className="mt-10 text-lg font-bold">Dataset:<span className="text-red-500 text-sm">*</span></h4>
                              <h4 className="mt-12 text-lg font-bold">Objects to Look For:</h4>
                              <h4 className="mt-12 text-lg font-bold">Object Detector Confidence Threshold:</h4>
                              <h4 className="mt-10 text-lg font-bold">Object Detector NMS Threshold:</h4>
                              <h4 className="mt-10 text-lg font-bold">Do Related product search?:</h4>

                            </>
                          )}
                          {taskType === 'product' && (
                            <>
                              <h4 className="mt-12 text-lg font-bold">Object Detector Confidence Threshold:</h4>
                              <h4 className="mt-10 text-lg font-bold">Object Detector NMS Threshold:</h4>
                              <h4 className="mt-10 text-lg font-bold">Do Related product search?:</h4>
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
                              className="bg-gray-600 rounded p-1"
                            >
                              <option value="">Select Task Type</option>
                              <option value="object">Object Detection</option>
                              <option value="product">Nike Shoe Detection</option>
                            </select>
                          </div>
                          {taskType === 'object' && (
                            <>
                              {/* Algorithm */}
                              <div className="mt-8 flex space-y-2">
                                <select
                                  required
                                  className="form-select bg-gray-600 rounded p-1"
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
                              <div className="mt-8 flex space-y-2">
                                <select
                                  required
                                  className="form-select bg-gray-600 rounded p-1"
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
                                className="bg-gray-600"
                                components={animatedComponents}
                                placeholder="Select objects"
                                defaultValue={selectedOption}
                                onChange={setSelectedOption}
                                options={options}
                              />
                              </div>
                              {/* Object Detector Confidence Threshold */}
                              <div className="mt-8 flex space-y-2">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="number"
                                    className="form-input w-16 bg-gray-600 rounded p-1"
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
                                    className="form-input w-16 bg-gray-600 rounded p-1"
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
                              <div className="mt- mb-12 flex space-y-2">
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
                                        doRelated ? 'bg-purple-700' : 'bg-gray-400'
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
                </div>
                {analyseError && <div className="text-red-500 text-center mt-10">{analyseError}</div>}
                <div className="mt-10 text-center flex items-center justify-center">
                  <button 
                    className="font-bold hover:text-slate-300 px-8 py-3 rounded bg-purple-700 text-white hover:bg-purple-800 transition duration-300"
                    type="submit"
                  >
                      {loading ? 'Analysing...' : 'Analyse'}
                  </button>
                </div>
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