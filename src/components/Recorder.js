import { ReactMediaRecorder, useReactMediaRecorder } from "react-media-recorder";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { Mic, StopFill } from 'react-bootstrap-icons';
import Spinner from 'react-bootstrap/Spinner';

export default function Recorder(props) {

    const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ audio: true });
    const [loading, setLoading] = useState(false);

    const patientTextHistory = props.patientTextHistory;

    var recording = status === "recording" || status === "acquiring_media" || status === "stopping";

    React.useEffect(() => {

        async function uploadVoice() {
          setLoading(true);
        //   patientTextHistory.append("Uploading audio...");
          const audioBlob = await fetch(mediaBlobUrl).then((r) => r.blob());
          const audiofile = new File([audioBlob], "audiofile.mpeg", {
            type: "audio/mpeg",
          });
          const formData = new FormData();
          formData.append("audio", audiofile);
          formData.append('patient_id', props.patientId);

          axios.post('http://127.0.0.1:5000/api/patient/audio_payload', formData)
          .then(response => {
            console.log(response.data);
                // patientTextHistory.startPrompt();
                // patientTextHistory.append(response.data.transcript);
                // patientTextHistory.endPrompt();

                // patientTextHistory.startResponse();
                // patientTextHistory.append(response.data.response);
                // patientTextHistory.endResponse();
                setLoading(false);
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
        <>
            <Button 
                variant='success' 
                onClick={startRecording}
                hidden={props.hidden || recording || loading}
            ><Mic/>
            </Button>
            <Button 
                variant='danger' 
                onClick={stopRecording}
                hidden={props.hidden || !recording || loading}
            ><StopFill/>
            </Button>
            <Button
              variant="dark"
              disabled={true} // always disabled (loading)
              type="submit"
              hidden={props.hidden || !loading}
              className="send-button"
            >
                <Spinner animation="border" role="status" size="sm"/>
            </Button>
            {/* <audio src={mediaBlobUrl} controls autoPlay loop /> */}
        </>
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