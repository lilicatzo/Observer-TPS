import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3001/api/chat", { message: input });
      const botMessage = { role: "bot", content: response.data.reply };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      const errorMessage = { role: "bot", content: "Sorry, I couldn't process your question." };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatMessage = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold text
      .replace(/^\*\*(.*?)\*\*/gm, "<strong>$1</strong>") // Bullets
      .replace(/##(.*?)(?=\n|$)/g, "<strong>$1</strong>"); // Bold text
  };

  return (
    <div className="chatbot-page">
      <div className="chatbot-container">
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="chat-message bot">
              <div>Welcome to Chatbot Page, Here you can ask questions regarding the experiences of the 3 candidates.</div>
            </div>
          )}
          {messages.map((message, index) => (
            <div key={index} className={`chat-message ${message.role}`}>
              <div dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }} />
            </div>
          ))}
          {loading && (
            <div className="chat-message bot">
              <div>...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask me about the candidates" onKeyPress={(e) => e.key === "Enter" && handleSend()} />
          <button onClick={handleSend}>Send</button>
          <button onClick={handleClear}>Clear</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
