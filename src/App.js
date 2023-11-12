import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import UploadWav from './Audio';
import TextForm from './Text';

import ChatBotApp from './components/ChatBotApp';
import Recorder from './components/Recorder';
import TextHistory from './components/TextHistory';

function App() {

  const [textHistory, setTextHistory] = useState("");
  const textHistoryObj = new TextHistory(textHistory, setTextHistory);

  return (
    <div className="App">
      <ChatBotApp textHistoryObj={textHistoryObj}/>
      <Recorder textHistoryObj={textHistoryObj}/>
      <UploadWav />
      <TextForm />
    </div>
  );
}

export default App;

