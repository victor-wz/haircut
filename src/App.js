import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import UploadWav from './Audio';

function App() {
  return (
    <div className="App">
      <UploadWav />
    </div>
  );
}

export default App;

