import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import io from 'socket.io-client';

const Stream = () => {
  const [output, setOutput] = useState('');
  const [socket, setSocket] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [ignoredContent, setIgnoredContent] = useState('');

  useEffect(() => {
    // Initialize WebSocket connection
    const socket = io('http://127.0.0.1:5000');
    setSocket(socket);

    // Listen for updates from the server
    socket.on('update_output', (data) => {
		if (!data.partial_result.startsWith('!!!')) {
			setOutput((prevOutput) => prevOutput + ' ' + data.partial_result);
		  }
		else {
			setShowAlert(true);
			const cleanedContent = data.partial_result.replace(/!/g, '');
			setIgnoredContent(cleanedContent);
		}
    });

    return () => {
      // Clean up the WebSocket connection
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <div>
        <h3>Output:</h3>
		<Alert show={showAlert} variant="warning" onClose={() => setShowAlert(false)} dismissible>
        Request made for {ignoredContent}.
		</Alert>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default Stream;
