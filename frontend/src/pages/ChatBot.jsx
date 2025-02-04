import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatBot = () => {
  const [question, setQuestion] = useState('');
  const [chatLog, setChatLog] = useState([
    { sender: 'bot', text: 'Hi! I’m your fashion advisor. Ask me anything about fashion!' }
  ]);

  const generateAnswer = async () => {
    if (!question.trim()) return;

    // Add user question to the chat log
    setChatLog((prevLog) => [...prevLog, { sender: 'user', text: question }]);

    // Show typing status
    setChatLog((prevLog) => [...prevLog, { sender: 'bot', text: 'Generating answer...' }]);

    try {
      const response = await axios({
        url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCzIdhyHN32U-_wISUuBogESfAJCHNOa00',
        method: 'post',
        data: {
          "contents": [
            {
              "parts": [{ "text": question }]
            }
          ]
        }
      });

      const aiResponse =
        response['data']['candidates'][0]['content']['parts'][0]['text'] ||
        'Sorry, I could not generate an answer. Please try again.';

      setChatLog((prevLog) => [...prevLog.slice(0, -1), { sender: 'bot', text: aiResponse }]);
    } catch (error) {
      setChatLog((prevLog) => [
        ...prevLog.slice(0, -1),
        { sender: 'bot', text: 'An error occurred. Please try again later.' }
      ]);
    }

    setQuestion(''); // Clear input field
  };

  useEffect(() => {
    // Scroll to the latest chat message
    const chatContainer = document.getElementById('chat-container');
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [chatLog]);

  return (
    <div className="max-w-lg m-20 mx-auto p-6 bg-background text-text">
      <h1 className="text-center text-3xl font-semibold text-secondary mb-4">FashionBot</h1>

      {/* Chat History */}
      <div
        id="chat-container"
        className="bg-primary text-text p-4 h-96 overflow-y-auto rounded-lg shadow-inner mb-4"
      >
        {chatLog.map((entry, index) => (
          <div
            key={index}
            className={`flex ${entry.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div
              className={`p-4 rounded-lg max-w-xs ${
                entry.sender === 'user' ? 'bg-secondary text-primary' : 'bg-white text-text'
              }`}
            >
              {/* <strong>{entry.sender === 'user' ? 'You' : 'Bot'}:</strong> */}
              <p>{entry.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* User Input */}
      <div className="flex flex-row gap-1">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask me anything about fashion!"
          rows="1"
          className="w-full p-4 border-2 border-secondary rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-secondary"
        />
        <button
          onClick={generateAnswer}
          className="bg-secondary text-primary font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-primary hover:text-secondary transition duration-300"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
