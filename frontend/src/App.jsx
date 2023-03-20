import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'

axios.defaults.baseURL = `http://localhost:5000`

function App() {

  useEffect(() => {
    axios.get('/members').then((res) => {
      console.log(res.data)
    })
  }, [])

  return (
    <div className="App">
      <img
        className="Video"
        src="http://localhost:5000/video_feed"
        alt="Video"
      />
    </div>
  )
}

export default App
