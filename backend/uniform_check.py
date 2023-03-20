from ultralytics import YOLO
import cv2
import matplotlib.colors as colors
import json
import random

class UniformCheck(object):
    
    def __init__(self):
        self.model = YOLO('./models/model_nano.pt')
        self.classes = ['shoes', 'polo', 'blouse', 'slacks', 'ID', 'necktie', 'skirt']
        self.colors = ['#57cfff','#60ff7a', '#f2ff4f' ,'#25a855', '#1787b4', '#98a500', '#e8d636']
        self.video = cv2.VideoCapture(0)

    def __del__(self):
        self.video.release()

    def get_video(self):
        
        ret, frame = self.video.read()
        results = self.model(frame)

        detected_objects = []  # List to store detected object names

        for result in results:
            boxes = result.boxes
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy.tolist()[0]
                hex_color = self.colors[int(box.cls)]
                rgb_color = colors.to_rgb(hex_color)
                color_tuple = tuple([int(255*x) for x in rgb_color])
                cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), color_tuple, thickness=2)
                text = f'{self.classes[int(box.cls)]} {box.conf.item()*100:.2f}%'
                cv2.putText(frame, text, (int(x1), int(y1)-5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color_tuple, thickness=1)
                # Add detected object name to list
                object_name = self.classes[int(box.cls)]
                if object_name not in detected_objects:
                    detected_objects.append(object_name)

        object_count = sum([len(result.boxes) for result in results])

        detection_data = {
            'total_objects': object_count,
            'objects_detected': detected_objects,  
        }
        
        ret, jpeg = cv2.imencode('.jpg', frame)
        return jpeg.tobytes(), detection_data
    
    # def get_model_data(self):
        
    #     ret, frame = self.video.read()
    #     results = self.model(frame)

    #     detected_classes = []
    #     detected_boxes = []
    #     detected_confidence = []

    #     for result in results:
    #         boxes = result.boxes
    #         for box in boxes:
    #             x1, y1, x2, y2 = box.xyxy.tolist()[0]
    #             detected_boxes.append([int(x1), int(y1), int(x2), int(y2)])
    #             detected_classes.append(self.classes[int(box.cls)])
    #             detected_confidence.append(box.conf.item()*100)
        
    #     model_data = {}
    #     data = {}
    #     for i in range(len(detected_classes)):
    #         cls = detected_classes[i]
    #         box = detected_boxes[i]
    #         conf = detected_confidence[i]
    #         data[cls] = {"box": box, "confidence": conf}
    #     model_data["classes"] = len(detected_classes)
    #     model_data["data"] = data
    #     json_string = json.dumps(model_data)
    #     return json_string.encode('utf-8')
    
    # def is_complete(self):
    #     #random 0 and 1
    #     #create a json string with the data "complete": "true" or "complete": "false"
    #     json_string = json.dumps({"complete": random.randint(0,1)})
    #     return json_string.encode('utf-8')
    


