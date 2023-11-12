import './ChatBotApp.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Row, Col } from 'react-bootstrap';
import Recorder from './Recorder';
import { Send } from 'react-bootstrap-icons';
import Spinner from 'react-bootstrap/Spinner';
import Stream from '../Stream';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const OpenAI = require("openai");

export default function ChatbotApp(props) {

  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const patientTextHistory = props.patientTextHistory;


  const [socket, setSocket] = useState(null);
  // const [showAlert, setShowAlert] = useState(false);
  // const [ignoredContent, setIgnoredContent] = useState('');

  useEffect(() => {
    // Initialize WebSocket connection
    const socket = io('http://127.0.0.1:5000');
    setSocket(socket);
    
    // Listen for updates from the server
    socket.on('update_output', (data) => {
      setLoading(false);
    if (data.partial_result.startsWith('!!!')) {
      // setShowAlert(true);
      const cleanedContent = data.partial_result.replace(/!/g, '');
      const values = "patient name, age, presenting problem, and history"
      axios.post('http://127.0.0.1:5000/api/patient/summary', { values: values, patient_id: props.patientId })
      .then(response => {
        console.log(response.data);
        props.patientTextHistory.appendAlert("Request made for " + cleanedContent + " with patient details \n <ul>" + response.data.summary.split("<ul>")[1].split("</ul>")[0] + "</ul>")
      })
      .catch(error => {
        console.error('Error submitting text:', error);
      });
      // setIgnoredContent(cleanedContent);
      }
    else if (data.partial_result.startsWith('???')) {
      // setShowAlert(true);
      const cleanedContent = data.partial_result.replace(/\?/g, '');
      const values = "patient name, age, presenting problem, and history"
      axios.post('http://127.0.0.1:5000/api/patient/summary', { values: values, patient_id: props.patientId })
      .then(response => {
        console.log(response.data);
        props.patientTextHistory.appendAlert("Prescription made for " + cleanedContent + " with patient details \n <ul>" + response.data.summary.split("<ul>")[1].split("</ul>")[0] + "</ul>")
      })
      .catch(error => {
        console.error('Error submitting text:', error);
      });
      // setIgnoredContent(cleanedContent);
      }
    else {
      props.patientTextHistory.append(' ' + data.partial_result)
      // setOutput((prevOutput) => prevOutput + ' ' + data.partial_result);
    }
    });

    return () => {
      // Clean up the WebSocket connection
      socket.disconnect();
    };
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("Prompt: ", prompt);

    patientTextHistory.startPrompt();
    patientTextHistory.append(prompt);
    patientTextHistory.endPrompt();

    try {
      // New
      patientTextHistory.startResponse();

      // const stream = await openai.chat.completions.create({
      //   model: "gpt-3.5-turbo",
      //   messages: [{ "role": "user", "content": prompt}],
      //   stream: true,
      // });
      // for await (const part of stream) {
      //   console.log(part.choices[0].delta);

      //   if (part.choices[0].delta.content) {
      //     patientTextHistory.append(part.choices[0].delta.content);
      //   }
      // }

      axios.post('http://127.0.0.1:5000/api/patient/text_payload', { text: prompt, patient_id: props.patientId })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error submitting text:', error);
      });


    } catch (e) {
      //console.log(e);
      patientTextHistory.append("Something is going wrong, Please try again.");
      throw e;
    }
    setPrompt("");
  };


  return (
    <div className="chat-bot-app">
      <div className="text-history">
        <div dangerouslySetInnerHTML={{ __html: patientTextHistory.text() }}></div>
      </div>

      <div className="input-container">
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
          <Col md={11}>
            <Form.Control
              type="text"
              value={prompt}
              placeholder="Type a note or query..."
              onChange={(e) => setPrompt(e.target.value)}
              className="text-input"
            ></Form.Control>
            </Col>
            <Col md={1}>
            <Button
              variant="dark"
              disabled={loading || prompt.length === 0}
              type="submit"
              hidden={prompt.length === 0}
              className="send-button"
            >
              {loading ?  <Spinner animation="border" role="status" size="sm"/> : <Send/>}
            </Button>
            <Recorder 
                patientTextHistory={patientTextHistory} 
              hidden={prompt.length > 0}
              patientId={props.patientId}
            />
            </Col>
          </Row>
        </Form>
      </div>


      
    </div>
  );
};
