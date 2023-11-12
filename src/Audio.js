import React, { useState } from 'react';
import axios from 'axios';

const UploadWav = () => {
  const [file, setFile] = useState(null);
  const [patientId, setPatientId] = useState(1);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handlePatientIdChange = (event) => {
    setPatientId(Number(event.target.value));
  };

  const handleUpload = () => {
    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('audio', file);
    formData.append('patient_id', patientId);
    
    axios.post('http://127.0.0.1:5000/api/patient/audio_payload', formData)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error uploading WAV file:', error);
      });
  };

  return (
    <div>
      <label>
        Patient ID:
        <input type="number" value={patientId} onChange={handlePatientIdChange} />
      </label>
      <br />
      <input type="file" accept=".wav, .mpeg, .m4a" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload WAV File</button>
    </div>
  );
};

export default UploadWav;
