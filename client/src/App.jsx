import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: "You", text: message };
    setChatLog((prev) => [...prev, userMessage]);
    setMessage("");

    try {
      const res = await fetch("https://react-express-gemini-chatbot.onrender.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setChatLog((prev) => [...prev, { sender: "Gemini", text: data.reply }]);
    } catch (error) {
      console.error("Error:", error);
      setChatLog((prev) => [
        ...prev,
        { sender: "Gemini", text: "Error connecting to server" },
      ]);
    }
  };

  return (
    <div className="full-width">
      <div className="chat-container">
        <h2 className="chat-heading">Gemini ChatBot</h2>
        {chatLog.length > 0 && (
          <div className="chat-log">
            {chatLog.map((msg, i) => (
              <p key={i}>
                <strong className="sender-name">{msg.sender}:</strong>{" "}
                <span className="message-text">{msg.text}</span>
              </p>
            ))}
          </div>
        )}
        <input
          className="chat-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />
        <button className="send-button" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;