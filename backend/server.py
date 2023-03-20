from flask import Flask, render_template, Response
from flask_cors import CORS, cross_origin
from uniform_check import UniformCheck
import time
import json

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

uniform_check = UniformCheck()

def gen():
    while True:
        frame_bytes  = uniform_check.get_video()
        yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n\r\n')

@app.route("/video_feed")
@cross_origin()
def video_feed():
    return Response(gen(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run(debug=True)