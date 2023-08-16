import cv2
import detectron2
from detectron2 import model_zoo
from detectron2.config import get_cfg
from detectron2.engine import DefaultPredictor
from detectron2.data import MetadataCatalog
import numpy as np
from detectron2.utils.logger import setup_logger
setup_logger()


CONFIG_FILE = "PascalVOC-Detection/faster_rcnn_R_50_C4.yaml"
WEIGHTS_FILE = "detectron2://PascalVOC-Detection/faster_rcnn_R_50_C4/142202221/model_final_b1acc2.pkl"

def plot_one_box(x, img, color=None, label=None, line_thickness=3):
    # Plots one bounding box on image img
    print("xL",type(x),"color",type(color))
    tl = line_thickness or round(0.002 * (img.shape[0] + img.shape[1]) / 2) + 1  # line/font thickness
    color = color or [random.randint(0, 255) for _ in range(3)]
    c1, c2 = (int(x[0]), int(x[1])), (int(x[2]), int(x[3]))
    cv2.rectangle(img, c1, c2, color, thickness=tl, lineType=cv2.LINE_AA)
    if label:
        tf = max(tl - 1, 1)  # font thickness
        t_size = cv2.getTextSize(label, 0, fontScale=tl / 3, thickness=tf)[0]
        c2 = c1[0] + t_size[0], c1[1] - t_size[1] - 3
        cv2.rectangle(img, c1, c2, color, -1, cv2.LINE_AA)  # filled
        cv2.putText(img, label, (c1[0], c1[1] - 2), 0, tl / 3, [225, 255, 255], thickness=tf, lineType=cv2.LINE_AA)

        
def getObjects(img, confThres, nmsThresh, objects=[], draw=True):
    cfg = get_cfg()
    cfg.merge_from_file(model_zoo.get_config_file(CONFIG_FILE))
    cfg.MODEL.ROI_HEADS.SCORE_THRESH_TEST = confThres
    # Overlap threshold used for non-maximum suppression (suppress boxes with
    # IoU >= this threshold)
    cfg.MODEL.ROI_HEADS.NMS_THRESH_TEST = nmsThresh
    cfg.MODEL.DEVICE = 'cpu'
    cfg.MODEL.WEIGHTS = WEIGHTS_FILE
    
    predictor = DefaultPredictor(cfg)
    outputs = predictor(img)

    instances = outputs["instances"]
    classIds = instances.pred_classes
    confs = instances.scores
    bbox = instances.pred_boxes.tensor.tolist()

    # Get the metadata for the dataset
    metadata = MetadataCatalog.get(cfg.DATASETS.TRAIN[0])
    colors = [[np.random.randint(0, 255) for _ in range(3)] for _ in metadata.thing_classes]
    objectInfo = []
    for classId, confidence, box in zip(classIds, confs, bbox):
        class_name = metadata.thing_classes[classId]
        if class_name in objects or len(objects)==0:
            score = confidence.item()
            box = np.array(box)
            label = f'{class_name} {str(round(score*100,2))}'
            plot_one_box(box, img, label=label, color=tuple(colors[int(classId)]), line_thickness=1)
            objectInfo.append([box, class_name, str(round(score*100,2))])

    return img, objectInfo

def detect(image_input_path, image_output_path, confThres, nmsThresh, objects=[]):
    img = cv2.imread(image_input_path)
    result, objectInfo = getObjects(img, confThres, nmsThresh, objects)
    cv2.imwrite(image_output_path, result)
    return objectInfo