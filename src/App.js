import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import UploadWav from './Audio';
import TextForm from './Text';

import ChatBotApp from './components/ChatBotApp';
import Stream from './Stream';
import TextHistory from './components/TextHistory';

function App() {

  const [textHistory, setTextHistory] = useState("");
  const textHistoryObj = new TextHistory(textHistory, setTextHistory);

  const [patientId, setPatientId] = useState(0);

  return (
    <div className="App">
      <ChatBotApp textHistoryObj={textHistoryObj} patientId={patientId}/>
      <UploadWav />
      <TextForm />
      {/* <Stream /> */}

    </div>
  );
}

export default App;

