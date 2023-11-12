import { useState } from "react"
import './ChatBotApp.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Row, Col } from 'react-bootstrap';
import Recorder from './Recorder';
import { Send } from 'react-bootstrap-icons';
import Spinner from 'react-bootstrap/Spinner';

const OpenAI = require("openai");

export default function ChatbotApp(props) {

  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const patientTextHistory = props.patientTextHistory;

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
      const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ "role": "user", "content": prompt}],
        stream: true,
      });
      for await (const part of stream) {
        console.log(part.choices[0].delta);

        if (part.choices[0].delta.content) {
          patientTextHistory.append(part.choices[0].delta.content);
        }
      }
      patientTextHistory.endResponse();

      // const result = await openai.chat.completions.create({
      //   model: "gpt-3.5-turbo",
      //   messages: [{"role": "user", "content": "Hello!"}],
      // });
      // console.log(result.choices[0].message);
      //console.log("response", result.data.choices[0].text);
    } catch (e) {
      //console.log(e);
      patientTextHistory.appendResponse("Something is going wrong, Please try again.");
    }
    setLoading(false);
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
