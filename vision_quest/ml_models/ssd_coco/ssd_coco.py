import cv2
import os
from random import randint
thres = 0.45 # Threshold to detect object
print()
classNames = []
#classFile = "/home/pi/Desktop/Object_Detection_Files/coco.names"
#classFile = "D:\Msc Big Data and HPC\Sem 3 - Dissertation\COCO- Rpie Implementation\Object_Detection_Files\Object_Detection_Files\coco.names"
f_path = "ml_models/ssd_coco"
classFile = f_path+"/coco.names"
with open(classFile,"rt") as f:
    classNames = f.read().rstrip("\n").split("\n")

#configPath = "/home/pi/Desktop/Object_Detection_Files/ssd_mobilenet_v3_large_coco_2020_01_14.pbtxt"
#configPath = "D:\Msc Big Data and HPC\Sem 3 - Dissertation\COCO- Rpie Implementation\Object_Detection_Files\Object_Detection_Files\ssd_mobilenet_v3_large_coco_2020_01_14.pbtxt"
configPath = f_path+"/ssd_mobilenet_v3_large_coco_2020_01_14.pbtxt"
#weightsPath = "/home/pi/Desktop/Object_Detection_Files/frozen_inference_graph.pb"
#weightsPath = "D:\Msc Big Data and HPC\Sem 3 - Dissertation\COCO- Rpie Implementation\Object_Detection_Files\Object_Detection_Files\frozen_inference_graph.pb"
weightsPath = f_path +"/frozen_inference_graph.pb"
net = cv2.dnn_DetectionModel(weightsPath,configPath)
net.setInputSize(320,320)
net.setInputScale(1.0/ 127.5)
net.setInputMean((127.5, 127.5, 127.5))
net.setInputSwapRB(True)

def plot_one_box(x, img, color=None, label=None, line_thickness=3):
    # Plots one bounding box on image img
    tl = line_thickness or round(0.002 * (img.shape[0] + img.shape[1]) / 2) + 1  # line/font thickness
    color = color or [random.randint(0, 255) for _ in range(3)]
    c1, c2 = (int(x[0]), int(x[1])), (int(x[2]), int(x[3]))
    cv2.rectangle(img, x, color, thickness=tl, lineType=cv2.LINE_AA)
    if label:
        tf = max(tl - 1, 1)  # font thickness
        t_size = cv2.getTextSize(label, 0, fontScale=tl / 3, thickness=tf)[0]
        c2 = c1[0] + t_size[0], c1[1] - t_size[1] - 3
        cv2.rectangle(img, c1, c2, color, -1, cv2.LINE_AA)  # filled
        cv2.putText(img, label, (c1[0], c1[1] - 2), 0, tl / 3, [225, 255, 255], thickness=tf, lineType=cv2.LINE_AA)

def getObjects(img, confThres, nmsThresh, objects=[], draw=True):
    print("nms:",nmsThresh)
    classIds, confs, bbox = net.detect(img,confThreshold=confThres,nmsThreshold=nmsThresh)
    object_colors = {}
    print("objjj",type(objects))
    # print("ClassNames",classNames)
    if len(objects) == 0: objects = classNames
    objectInfo =[]
    if len(classIds) != 0:
        for classId, confidence,box in zip(classIds.flatten(),confs.flatten(),bbox):
            className = classNames[classId - 1]
            #print("clasName",className)
            if className in objects:
            	# Check if the object already has a color assigned
                if className in object_colors:
                    color = object_colors[className]
                else:
                	color = (randint(0, 255), randint(0, 255), randint(0, 255))
                	object_colors[className] = color

                objectInfo.append([box,className, str(round(confidence*100,2))])
                if (draw):
                    label = f'{className} {str(round(confidence*100,2))}'
                    plot_one_box(box, img, label=label, color=color, line_thickness=1)
                    # cv2.rectangle(img,box,color=color,thickness=2)
                    # cv2.putText(img,classNames[classId-1].upper(),(box[0]+10,box[1]+30),
                    # cv2.FONT_HERSHEY_COMPLEX,1,color,2)
                    # cv2.putText(img,str(round(confidence*100,2)),(box[0]+200,box[1]+30),
                    # cv2.FONT_HERSHEY_COMPLEX,1,color,2)
    print("Object INFo:",objectInfo)
    return img,objectInfo

def detect(image_input_path, image_ouput_path, confThresh, nmsThresh, objects=[]):
    img = cv2.imread(image_input_path)
    result, objectInfo = getObjects(img, confThresh, nmsThresh, objects)
    print("pasas", objectInfo)
    cv2.imwrite(image_ouput_path, result)
    return objectInfo
if __name__ == "__main__":

    cap = cv2.VideoCapture(0)
    cap.set(3,640)
    cap.set(4,480)
    #cap.set(10,70)


    while True:
        success, img = cap.read()
        result, objectInfo = getObjects(img,0.25,0.2,objects = [])
        #print(objectInfo)
        cv2.imshow("Output",img)
        cv2.waitKey(1)
