import { ReactMediaRecorder, useReactMediaRecorder } from "react-media-recorder";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Recorder() {

    // let audio, setAudio = useState(null);

    // function upload(mediaBlobUrl) {
    //     console.log("uploading...", mediaBlobUrl);
    //     // debugger;
    //     // if (audio != null) {
    //         //load blob
    //         var xhr_get_audio = new XMLHttpRequest();
    //         xhr_get_audio.open('GET', mediaBlobUrl, true);
    //         xhr_get_audio.responseType = 'blob';
    //         xhr_get_audio.onload = function(e) {
    //             if (this.status == 200) {
    //                 var blob = this.response;
    //                 //send the blob to the server
    //                 var xhr_send = new XMLHttpRequest();
    //                 var filename = new Date().toISOString();
    //                 xhr_get_audio.onload = function (e) {
    //                     if (this.readyState === 4) {
    //                         console.log("Server returned: ", e.target.responseText);
    //                     }
    //                 };
    //                 var fd = new FormData();
    //                 fd.append("audio_data",blob, filename);
    //                 xhr_send.open("POST", "http://localhost/uploadAudio", 
    //                 true);
    //                 xhr_send.send(fd);
    //             }
    //         };
    //         xhr_get_audio.send();
    //     // }
    // } 

    const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ audio: true });

    React.useEffect(() => {

        async function uploadVoice() {
          const audioBlob = await fetch(mediaBlobUrl).then((r) => r.blob());
          debugger;
          const audiofile = new File([audioBlob], "audiofile.mpeg", {
            type: "audio/mpeg",
          });
          const formData = new FormData();
          formData.append("file", audiofile);
          await axios.post(
            'localhost/uploadAudio',
            formData,
            {
              "content-type": "multipart/form-data",
            }
          );
    
        }
        if (mediaBlobUrl) {
          uploadVoice();
        }
    
      }, [mediaBlobUrl]);


    return (
        <div>
          <p>{status}</p>
          <button onClick={startRecording}>Start Recording</button>
          {/* <button onClick={() => {stopRecording(); upload(mediaBlobUrl)}}>Stop Recording</button> */}
          <button onClick={stopRecording}>Stop Recording</button>
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