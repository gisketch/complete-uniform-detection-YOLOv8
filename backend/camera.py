from ultralytics import YOLO
import cv2
import matplotlib.colors as colors

class UniformCheck(object):
    def __init__(self):
        self.model = YOLO('./models/model_nano.pt')
        self.classes = ['shoes', 'polo', 'blouse', 'slacks', 'ID', 'necktie', 'skirt']
        self.colors = ['#57cfff','#60ff7a', '#f2ff4f' ,'#25a855', '#1787b4', '#98a500', '#e8d636']
        self.video = cv2.VideoCapture(0)
    def __del__(self):
        self.video.release()
    def get_frame(self):
        ret, frame = self.video.read()
        results = self.model(frame)
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
        ret, jpeg = cv2.imencode('.jpg', frame)
        return jpeg.tobytes()


# cap = cv2.VideoCapture(0)

# while True:
#     ret, frame = cap.read()

#     # Detect objects in the frame
#     results = model(frame)

#     for result in results:
#         boxes = result.boxes
#         for box in boxes:
#             x1, y1, x2, y2 = box.xyxy.tolist()[0]

#             hex_color = color[int(box.cls)]
#             rgb_color = colors.to_rgb(hex_color)
#             color_tuple = tuple([int(255*x) for x in rgb_color])

#             cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), color_tuple, thickness=2)

#             text = f'{classes[int(box.cls)]} {box.conf.item()*100:.2f}%'

#             cv2.putText(frame, text, (int(x1), int(y1)-5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color_tuple, thickness=1)

#     cv2.imshow('frame', frame)

#     if cv2.waitKey(1) & 0xFF == ord('q'):
#         break

# cap.release()
# cv2.destroyAllWindows()