from flask import Flask, render_template, Response
from flask_cors import CORS, cross_origin
from uniform_check import UniformCheck
from flask_socketio import SocketIO, emit
import time
import json

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Add the following line
socketio = SocketIO(app, cors_allowed_origins="*")

uniform_check = UniformCheck()

def gen():
    while True:
        frame_bytes, detection_data = uniform_check.get_video()
        socketio.emit('detection_data', json.dumps(detection_data))
        yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n\r\n')

@app.route("/video_feed")
@cross_origin()
def video_feed():
    return Response(gen(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    socketio.run(app, debug=True)