# 🎒 Uniform Detection Software 👞 

This repository houses the source code for the Uniform Detection Software, as described in the paper ["Development of a Uniform Detection Software Using YOLOv8 Algorithm for the University of Southern Mindanao Students"](https://github.com/gisketch/complete-uniform-detection-YOLOv8/files/11717858/THESIS.MANUSCRIPT.pdf) by Joshua Tejedor. I took charge of programming and development for this project. The software employs the YOLOv8 algorithm to analyze video footage captured by a camera, enabling it to determine whether students at the University of Southern Mindanao (USM) are wearing complete or incomplete uniforms.

## Summary

The Uniform Detection Software is an advanced application that utilizes the YOLOv8 algorithm for real-time object detection to determine whether University of Southern Mindanao (USM) students are wearing complete or incomplete uniforms. By analyzing video footage, the software accurately identifies students and logs their uniform status, promoting a more organized and disciplined campus environment. With its efficient and automated approach, the software replaces manual inspections, saving time and ensuring compliance with the university's dress code policy.

## Features

The Uniform Detection Software offers the following features:

- Real-time detection of students wearing complete or incomplete uniforms
- Logging of detected students with details such as time of detection, gender, and uniform completeness
- Database of logs for further analysis and record-keeping
- User-friendly interface for easy interaction

## Installation

### Backend (Python Flask Server)

1. Clone the repository:

```bash
git clone https://github.com/gisketch/complete-uniform-detection-YOLOv8
```

2. Navigate to the backend directory:

```bash
cd backend
```

3. Install the required dependencies:

```bash
pip install -r requirements.txt
```

4. Start the server:

```bash
python server.py
```

### Frontend (ReactJS)

1. Clone the repository:

```bash
cd frontend
```

2. Install the required dependencies:

```bash
npm install
```

3. Start the React development server:

```bash
npm run dev
```

## Screenshots

![image](https://github.com/gisketch/complete-uniform-detection-YOLOv8/assets/78424395/890c9cd5-a480-48b1-bee7-5b6cd752ef24)

![image](https://github.com/gisketch/complete-uniform-detection-YOLOv8/assets/78424395/a1999b35-e29d-4cf6-bfd3-9b9c197abac4)


## Contributing

Contributions to the Uniform Detection Software are welcome. If you encounter any issues or have suggestions for improvements, please open an issue or submit a pull request.
