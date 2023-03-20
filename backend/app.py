from flask import Flask, render_template, Response
from ultralytics import YOLO
import cv2
import matplotlib.colors as colors

model = YOLO('./models/model_nano.pt')
classes = ['shoes', 'polo', 'blouse', 'slacks', 'ID', 'necktie', 'skirt']
color = ['#57cfff','#60ff7a', '#f2ff4f' ,'#25a855', '#1787b4', '#98a500', '#e8d636']

app = Flask(__name__)
cap = cv2.VideoCapture(0)

def generate_frames():
    while True:
        success, frame = cap.read()

        if not success:
            break
        else:
            # Detect objects in the frame
            results = model(frame)

            for result in results:
                boxes = result.boxes
                for box in boxes:
                    x1, y1, x2, y2 = box.xyxy.tolist()[0]

                    hex_color = color[int(box.cls)]
                    rgb_color = colors.to_rgb(hex_color)
                    color_tuple = tuple([int(255*x) for x in rgb_color])

                    cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), color_tuple, thickness=2)

                    text = f'{classes[int(box.cls)]} {box.conf.item()*100:.2f}%'

                    cv2.putText(frame, text, (int(x1), int(y1)-5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color_tuple, thickness=1)
        
        yield(b'--frame\r\n'
                  b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video')
def video():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run(debug=True)