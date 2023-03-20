import { useEffect, useState } from 'react';
import './App.css';
import io from 'socket.io-client';
import { motion } from 'framer-motion';

import { ReactSVG } from 'react-svg';
import blouseIcon from './assets/blouse.svg';
import idIcon from './assets/id.svg';
import poloIcon from './assets/polo.svg';
import shoesIcon from './assets/shoes.svg';
import skirtIcon from './assets/skirt.svg';
import slacksIcon from './assets/slacks.svg';
import necktieIcon from './assets/necktie.svg';

function App() {

  const [socket, setSocket] = useState(null);
  const [detectionData, setDetectionData] = useState({});
  const [totalObjects, setTotalObjects] = useState(0);
  const [objectsDetected, setObjectsDetected] = useState([]);

  const [gatheringData, setGatheringData] = useState(false);

  const [objectsGathered, setObjectsGathered] = useState([]);

  const [completeMale, setCompleteMale] = useState(0);
  const [completeFemale, setCompleteFemale] = useState(0);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('detection_data', (data) => {
      const detectData = JSON.parse(data)
      setDetectionData(detectData);
      setTotalObjects(detectData.total_objects);
      setObjectsDetected(detectData.objects_detected);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  //if totalObjects > 1, then we have a person
  const handleGatheringData = () => {
    if (totalObjects > 1) {
      setGatheringData(true);
    } else {
      setGatheringData(false);
    }
  };

  //while gathering data, append every object detected to objectsGathered, dont append duplicates
  const handleObjectsGathered = () => {
    if (gatheringData) {
      if (objectsGathered.length === 0) {
        setObjectsGathered(objectsDetected);
      } else {
        const newObjectsGathered = objectsGathered.concat(objectsDetected);
        const uniqueObjectsGathered = [...new Set(newObjectsGathered)];
        setObjectsGathered(uniqueObjectsGathered);
      }
    }

    if (!gatheringData) {
      setObjectsGathered([]);
    }
  };

  //if objectsGathered contains (ID, Polo, Slacks, Shoes) completeMale is true
  //if objectsGathered contains (ID, Blouse, Skirt, Shoes, Necktie) completeFemale is true
  const handleCompleteMale = () => {
    if (objectsGathered.includes('ID') && objectsGathered.includes('polo') && objectsGathered.includes('slacks') && objectsGathered.includes('shoes')) {
      setCompleteMale(1);
    }
  };

  const handleCompleteFemale = () => {
    if (objectsGathered.includes('ID') && objectsGathered.includes('blouse') && objectsGathered.includes('skirt') && objectsGathered.includes('shoes') && objectsGathered.includes('necktie')) {
      setCompleteFemale(1);
    }
  };


  useEffect(() => {
    handleGatheringData();
    handleObjectsGathered();
    handleCompleteMale();
    handleCompleteFemale();
  }, [totalObjects, objectsDetected]);

  const objectIcons = {
    'ID': idIcon,
    'necktie': necktieIcon,
    'polo': poloIcon,
    'blouse': blouseIcon,
    'slacks': slacksIcon,
    'skirt': skirtIcon,
    'shoes': shoesIcon,
  };

  const iconArray = Object.entries(objectIcons);

  return (
    <div className="App">
      <div className="Header">
        <h1 className="Header_Title">
          Complete Uniform Detection System
        </h1>
        <h2 className="Header_Subtitle">
          Joshua M. Tejedor
        </h2>
      </div>
      <div className="Video_Container">
        <motion.img
          className="Video"
          animate={
            {
              borderColor: gatheringData ? "var(--green)" : "var(--grey)",
            }
          }
          src="http://localhost:5000/video_feed"
          alt="Video"
        />
        <div className="Data_Container">
          <div className="Total_Objects">
            <p className="Total_Objects_Text">
              Total objects 
            </p>
            <p className="Total_Objects_Number">
              {totalObjects}
            </p>
          </div>
          <div className="Detected_Objects">
            <p className="Detected_Objects_Text">
              Detected objects
            </p>
            <div className="Object_Icons">
                {iconArray.map((object, index) => {
                  return (
                    <div className={`Object ${index === iconArray.length - 1 ? "Last-Item" : ""}`}>
                      <motion.div className={`Object_Icon ${objectsGathered.indexOf(object[0]) === -1 ? "Inactive" : "Active"}`} key={index}>
                        <ReactSVG src={object[1]} />
                      </motion.div>
                      <div className={`Object_Text ${objectsGathered.indexOf(object[0]) === -1 ? "Inactive" : "Active"}`}>
                        {object[0].toUpperCase()}
                      </div>
                    </div>
                  )}
                )}
            </div>
          </div>
          {/* <div>
            Gathering data: {gatheringData ? "Yes" : "No"}
          </div>
          <div>
            Objects gathered: {objectsGathered ? objectsGathered.join(', ') : ""}
          </div>
          <div>
            Complete: {completeMale ? "Male" : ""} {completeFemale ? "Female" : ""}
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default App;