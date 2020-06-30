import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:8080";

function TestSocket() {
  const [response, setResponse] = useState("First thing");

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("chat message", data => {
      setResponse(data);
    });
  }, []);

  return (
    <p>
      {response}
    </p>
  );
}

export default TestSocket;
