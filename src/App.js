import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import UploadWav from './Audio';
import TextForm from './Text';

import PatientSelector from './components/PatientSelector';
import ChatBotApp from './components/ChatBotApp';
import Stream from './Stream';
import TextHistory from './components/TextHistory';


function App() {

  
  const [textHistory, setTextHistory] = useState([]);
  const patientTextHistory = new TextHistory(textHistory, setTextHistory);
  
  const [patientId, setPatientId] = useState(0);
  patientTextHistory.setPatientId(patientId);

  useEffect(() => {
    console.log(patientTextHistory.text());
  });

  return (
    <div className="App">
      <PatientSelector patientId={patientId} setPatientId={setPatientId} />
      <ChatBotApp patientTextHistory={patientTextHistory} patientId={patientId} />
      {/* <UploadWav /> */}
      {/* <TextForm /> */}
      {/* <Stream /> */}

    </div>
  );
}

export default App;

