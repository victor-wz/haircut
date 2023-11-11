import React, { useState } from 'react';
import axios from 'axios';

const UploadWav = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('audio', file);

    axios.post('http://localhost:5000/api/patient/audio_payload', formData)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error uploading WAV file:', error);
      });
  };

  return (
    <div>
      <input type="file" accept=".wav, .mpeg" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload WAV File</button>
    </div>
  );
};

export default UploadWav;
