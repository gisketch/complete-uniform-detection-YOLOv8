from flask import Flask, render_template, Response
from flask_cors import CORS, cross_origin
from camera import UniformCheck

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Members API route
@app.route("/members")
@cross_origin()
def members():
    response =  {"members": ["John", "Paul", "George", "Ringo"]}
    return response

def gen(camera):
    """Video streaming generator function."""
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
        
@app.route("/video_feed")
@cross_origin()
def video_feed():
    return Response(gen(UniformCheck()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, threaded=True, use_reloader=False)