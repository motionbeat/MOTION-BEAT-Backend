import React, { useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [echo, setEcho] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5001/api/echo/${message}`);
    const data = await response.json();
    setEcho(data.echo);
  };

  return (
    <div>
      <h1>Echo App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <p>Echo: {echo}</p>
    </div>
  );
}

export default App;
