import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const Stream = () => {
  const [output, setOutput] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const socket = io('http://127.0.0.1:5000');
    setSocket(socket);

    // Listen for updates from the server
    socket.on('update_output', (data) => {
      setOutput((prevOutput) => prevOutput + " " + data.partial_result);
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
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default Stream;
