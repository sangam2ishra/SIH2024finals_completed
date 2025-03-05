from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import cv2
import utils

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/measure', methods=['POST'])
def measure_object():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    
    image_file = request.files['image']
    image_path = f"./uploads/{image_file.filename}"
    image_file.save(image_path)

    try:
        # Read the image
        img = cv2.imread(image_path)

        # Process the image
        scale = 3
        wP = 210 * scale
        hP = 297 * scale
        imgContours, conts = utils.getContours(img, minArea=50000, filter=4)

        if len(conts) != 0:
            biggest = conts[0][2]
            imgWarp = utils.warpImg(img, biggest, wP, hP)
            imgContours2, conts2 = utils.getContours(
                imgWarp, minArea=2000, filter=4, cThr=[50, 50], draw=False)

            measurements = []
            for obj in conts2:
                nPoints = utils.reorder(obj[2])
                nW = round((utils.findDis(nPoints[0][0] // scale, nPoints[1][0] // scale) / 10), 1)
                nH = round((utils.findDis(nPoints[0][0] // scale, nPoints[2][0] // scale) / 10), 1)
                measurements.append({"width": nW, "height": nH})

            return jsonify({"measurements": measurements})

        return jsonify({"error": "No valid contours found"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Run Flask on port 5000
