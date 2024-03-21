import React, { useState } from 'react';

const Predictions = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, { text: newMessage, user: 'User' }]);
      setNewMessage('');
    }
  };

  return (
    <div>
      <h2>Predictions Forum</h2>
      <div style={{ maxHeight: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
        {messages.map((message, index) => (
          <div key={index} style={{ marginBottom: '5px' }}>
            <strong>{message.user}:</strong> {message.text}
          </div>
        ))}
      </div>
      <textarea
        value={newMessage}
        onChange={handleMessageChange}
        placeholder="Type your message here..."
        style={{ width: '100%', marginTop: '10px' }}
      />
      <button onClick={handleSendMessage} style={{ marginTop: '10px' }}>Send</button>
    </div>
  );
};

export default Predictions;
