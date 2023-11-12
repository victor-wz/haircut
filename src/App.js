import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import UploadWav from './Audio';
import TextForm from './Text';

import ChatBotApp from './components/ChatBotApp';
import Recorder from './components/Recorder';
import Stream from './Stream';

function App() {
  // const [data, setData] = useState({});

  // useEffect(() => {
  //   axios.get('http://localhost:5000/api/data')
  //     .then(response => setData(response.data))
  //     .catch(error => console.error('Error fetching data:', error));
  // }, []);

  return (
    <div className="App">
      <ChatBotApp />
      <Recorder />
      <UploadWav />
      <TextForm />
      <Stream />

    </div>
  );
}

export default App;

