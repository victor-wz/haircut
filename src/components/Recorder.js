import { ReactMediaRecorder, useReactMediaRecorder } from "react-media-recorder";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

export default function Recorder(props) {

    const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ audio: true });
    const textHistoryObj = props.textHistoryObj;

    React.useEffect(() => {

        async function uploadVoice() {
          textHistoryObj.append("Uploading audio...");
          const audioBlob = await fetch(mediaBlobUrl).then((r) => r.blob());
          const audiofile = new File([audioBlob], "audiofile.mpeg", {
            type: "audio/mpeg",
          });
          const formData = new FormData();
          formData.append("audio", audiofile);
          axios.post('http://127.0.0.1:5000/api/patient/audio_payload', formData)
          .then(response => {
            console.log(response.data);
            textHistoryObj.startResponse();
            textHistoryObj.append(response.data);
            textHistoryObj.endResponse();
          })
          .catch(error => {
            console.error('Error uploading WAV file:', error);
          });       
          
        }
        if (mediaBlobUrl) {
          uploadVoice();
        }
    
      }, [mediaBlobUrl]);


    return (
        <div className="recorder">
          {/* <p>{status}</p> */}
          <Button variant='success' onClick={startRecording}>Start Recording</Button>
          {/* <button onClick={() => {stopRecording(); upload(mediaBlobUrl)}}>Stop Recording</button> */}
          <Button variant='danger' onClick={stopRecording}>Stop Recording</Button>
          <audio src={mediaBlobUrl} controls autoPlay loop />
        </div>
      );

    // return <ReactMediaRecorder
    //             audio
    //             whenStopped={blobUrl => {
    //                 console.log("Stopped");
    //                 console.log(blobUrl);
    //                 setAudio(blobUrl)
    //             }}
    //             render={({startRecording, stopRecording, mediaBlob }) => (
    //                 <div>
    //                     <button id="recorder" className="button" onClick={startRecording}>Start Recording</button>
    //                     <button className="button" onClick={() => {stopRecording(); upload(mediaBlob)}}>Stop Recording</button>
    //                     <audio id="player" src={mediaBlob} controls />
    //                 </div>
    //             )}
    //         />

}