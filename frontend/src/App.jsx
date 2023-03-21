import { useEffect, useState, useRef } from 'react';
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
  const [database, setDatabase] = useState([]);

  const [objectsGathered, setObjectsGathered] = useState([]);
  
  const [selectedData, setSelectedData] = useState(null);

  const imgRef = useRef(null);
  
  const [screenshot, setScreenshot] = useState(null);

  const clothItems = [
    "ID",
    "slacks",
    "polo",
    "shoes",
    "necktie",
    "blouse",
    "skirt"
  ];

  const databaseRef = useRef();

  useEffect(() => {
    if (databaseRef.current) {
      databaseRef.current.scrollTop = databaseRef.current.scrollHeight - databaseRef.current.clientHeight;
    }
  }, [database]);

  const handleTakeScreenshot = () => {
    const img = document.querySelector('#video-image');
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL();
    setScreenshot(dataURL);
    console.log(dataURL);
  };

  const checkItems = (objectsGathered) => {
    const items1 = ["ID", "slacks", "polo", "shoes"];
    const items2 = ["ID", "necktie", "blouse", "shoes", "skirt"];
  
    const containsItems1 = items1.every(item => objectsGathered.includes(item));
    const containsItems2 = items2.every(item => objectsGathered.includes(item));
  
    return containsItems1 || containsItems2;
  }

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

  useEffect(() => {
    let timer;
    if (totalObjects > 0) {
      if (!gatheringData) {
        setGatheringData(true);
      }
      clearTimeout(timer);
    } else {
      timer = setTimeout(() => {
        setGatheringData(false);
      }, 2000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [totalObjects, gatheringData]);

  const determineGenderAndMissingItems = (objectsGathered) => {
    const maleItems = ["slacks", "polo"];
    const femaleItems = ["blouse", "skirt", "necktie"];
    const universalItems = ["ID", "shoes"];

    // Assign scores based on the detected items
    const maleScore = maleItems.reduce((score, item) => score + (objectsGathered.includes(item) ? 1 : 0), 0);
    const femaleScore = femaleItems.reduce((score, item) => score + (objectsGathered.includes(item) ? 1 : 0), 0);

    let gender, missingItems;

    // Select the gender with the highest score
    if (maleScore > femaleScore) {
      gender = "male";
      missingItems = [...universalItems, ...maleItems].filter(item => !objectsGathered.includes(item));
    } else if (femaleScore > maleScore) {
      gender = "female";
      missingItems = [...universalItems, ...femaleItems].filter(item => !objectsGathered.includes(item));
    } else {
      gender = "unknown";
      missingItems = [];
    }

    return { gender, missingItems };
  };
  

  useEffect(() => {

  if (!gatheringData && objectsGathered.length > 0) {
    console.log("Gathering complete");
    setImageCaptured(false);

    if (objectsGathered.length > 1) {
      console.log("saving to database");
      const { gender, missingItems } = determineGenderAndMissingItems(objectsGathered);
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleString();
      setDatabase([...database, {
        image: screenshot,
        objects: objectsGathered,
        complete: checkItems(objectsGathered),
        gender,
        missingItems,
        timestamp: formattedDate,
      }]);
    }

    setObjectsGathered([]);
  }
}, [gatheringData]);

  const [imageCaptured, setImageCaptured] = useState(false);

  useEffect(() => {
    let timer;
    if (gatheringData && !imageCaptured) {
      timer = setTimeout(() => {
        captureImage();
        setImageCaptured(true);
      }, 500);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [gatheringData, imageCaptured]);

  const captureImage = () => {
    handleTakeScreenshot();
    console.log("Image Captured");
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
  };
  
  useEffect(() => {
    handleObjectsGathered();
  }, [gatheringData, objectsDetected]);
  
  // const handleGatheringData = () => {
  //   if (totalObjects > 0) {
  //     setGatheringData(true);
  //   } else {
  //     setGatheringData(false);
  //   }
  // };

  // useEffect(() => {
  //   handleGatheringData();
  // }, [totalObjects]);
  
  

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

  const handleDatabaseItemClick = (data) => {
    setSelectedData(data);
    console.log(data);
  }

  const clearSelectedData = () => {
    setSelectedData(null);
  }

  return (
    <div className="App">
      {
        selectedData && (
        <motion.div
          initial={{opacity: 0,}}
          animate={{opacity: 1,}}
          className="Data_Popup"
          onClick={()=>{clearSelectedData()}}>
          <img src={selectedData.image} alt="Selected Data" className="Data_Popup_Image" />
          <div className="Data_Popup_Info">
            <p className="Gender">{selectedData.gender.toUpperCase()}</p>
            <p className="Complete" style={{color: selectedData.complete ? "var(--green)" : "var(--red)"}}>{selectedData.complete ? "Complete Uniform" : "Incomplete Uniform"}</p>
            <p className="Missing">Missing Items: {selectedData.missingItems.join(', ')}</p>
            <p className="Timestamp">{selectedData.timestamp}</p>
          </div>
        </motion.div>
        )
      }
      {
        selectedData && (
          <div className="Black_Overlay" onClick={()=>{clearSelectedData()}}/>
        )
      }
      <div className="Header">
        <h1 className="Header_Title">
          Complete Uniform Detection System
        </h1>
        <h2 className="Header_Subtitle">
          Joshua M. Tejedor - 4-BSEcE-A
        </h2>
      </div>
      <div className="Video_Container">
        <motion.img
          className="Video"
          id="video-image"
          ref={imgRef} // Add ref to the img element
          animate={
            {
              borderColor: gatheringData ? "var(--green)" : "var(--grey)",
            }
          }
          src="/video_feed"
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
                    <div className={`Object ${index === iconArray.length - 1 ? "Last-Item" : ""}`} key={index}>
                      <motion.div className={`Object_Icon ${objectsGathered.indexOf(object[0]) === -1 ? "Inactive" : "Active"}`}>
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
        </div>
        <div className="Database_Container">
          <div className="Database_Title">
            Student Logs
          </div>
          <div ref={databaseRef} className="Database">
            {database.map((data, index) => {
              return (
                <motion.div
                  initial={{scale: 0}}
                  animate={{scale: 0.9}}
                  whileHover={{scale: 1}}
                  whileTap={{scale:0.9}}
                  className={`Database_Item`}
                  key={index}
                  style={{borderColor: data.complete ? "var(--green)" : "var(--red)"}}
                  onClick={() => handleDatabaseItemClick(data)}
                  >
                  <img className={`Database_Image`} src={data.image} alt="Database Image" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;