import cv2
import os
thres = 0.45 # Threshold to detect object
print()
classNames = []
#classFile = "/home/pi/Desktop/Object_Detection_Files/coco.names"
#classFile = "D:\Msc Big Data and HPC\Sem 3 - Dissertation\COCO- Rpie Implementation\Object_Detection_Files\Object_Detection_Files\coco.names"
f_path = "models/ssd_coco"
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


def getObjects(img, thres, nms, draw=True, objects=[]):
    classIds, confs, bbox = net.detect(img,confThreshold=thres,nmsThreshold=nms)
    #print("predicing",classIds,bbox)
    if len(objects) == 0: objects = classNames
    objectInfo =[]
    if len(classIds) != 0:
        for classId, confidence,box in zip(classIds.flatten(),confs.flatten(),bbox):
            className = classNames[classId - 1]
            #print("clasName",className)
            if className in objects:
                objectInfo.append([box,className])
                if (draw):
                    cv2.rectangle(img,box,color=(0,255,0),thickness=2)
                    cv2.putText(img,classNames[classId-1].upper(),(box[0]+10,box[1]+30),
                    cv2.FONT_HERSHEY_COMPLEX,1,(0,255,0),2)
                    cv2.putText(img,str(round(confidence*100,2)),(box[0]+200,box[1]+30),
                    cv2.FONT_HERSHEY_COMPLEX,1,(0,255,0),2)

    return img,objectInfo

def detect1(image_input_path, image_ouput_path):
    
    img = cv2.imread(image_input_path)
    result, objectInfo = getObjects(img, 0.50, 0.7, objects=[])
    # print(result, objectInfo)
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
