import React, { useState, useEffect, useRef } from "react";
import { Send, Image, X } from "lucide-react";

const ChatBot = () => {
  const [question, setQuestion] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [image, setImage] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCzIdhyHN32U-_wISUuBogESfAJCHNOa00";

  const generateAnswer = async () => {
    if (!question.trim() && !image) return;

    setShowChat(true);
    const newUserMessage = { sender: "user", text: question, image };
    setChatLog((prevLog) => [...prevLog, newUserMessage]);
    setChatLog((prevLog) => [...prevLog, { sender: "bot", text: "Typing..." }]);

    try {
      const imageData = image ? {
        inline_data: {
          mime_type: image.type,
          data: image.base64
        }
      } : null;

      const formData = {
        contents: [{
          parts: [
            { text: question },
            ...(imageData ? [imageData] : [])
          ]
        }]
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/\*\*(.*?)\*\*/g, "$1").trim() ||
        "Sorry, I couldn't generate an answer. Try again.";

      setChatLog((prevLog) => [...prevLog.slice(0, -1), { sender: "bot", text: aiResponse }]);
    } catch (error) {
      console.error(error);
      setChatLog((prevLog) => [
        ...prevLog.slice(0, -1),
        { sender: "bot", text: "An error occurred. Please try again later." }
      ]);
    }

    setQuestion("");
    setImage(null);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      generateAnswer();
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64string = reader.result.split(",")[1];
        setImage({
          preview: reader.result,
          type: file.type,
          base64: base64string,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatLog]);

  return (
    <div className="flex flex-col min-h-screen">
      {showChat ? (
        <div className="flex-1 flex flex-col p-6 m-20 max-w-3xl mx-auto w-full">
          {/* Chat Log Container */}
          <div 
            ref={chatContainerRef} 
            className="flex-1 bg-primary p-4 overflow-y-auto rounded-lg shadow-inner mb-4 space-y-4"
          >
            {chatLog.map((entry, index) => (
              <div 
                key={index} 
                className={`flex ${entry.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`p-3 rounded-xl max-w-sm ${
                    entry.sender === "user" 
                      ? "bg-background text-secondary" 
                      : "bg-white text-secondary border border-gray-200"
                  }`}
                >
                  {entry.image && (
                    <img 
                      src={entry.image.preview} 
                      alt="Uploaded" 
                      className="w-full max-w-xs mb-2 rounded-lg object-cover" 
                    />
                  )}
                  <p className="whitespace-pre-wrap">{entry.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Section */}
          <div className="relative">
            {/* Image Upload Section */}
            {image && (
              <div className="mb-4 flex items-center space-x-4">
                <div className="relative w-32 h-32">
                  <img 
                    src={image.preview} 
                    alt="Selected" 
                    className="w-full h-full rounded-lg object-cover border-2 border-gray-300 shadow-md" 
                  />
                  <button 
                    onClick={removeImage} 
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 truncate">
                  <p className="text-sm text-secondary font-medium truncate">{image.name}</p>
                </div>
              </div>
            )}

            {/* Search Input Section */}
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={question} 
                onChange={(e) => setQuestion(e.target.value)} 
                onKeyDown={handleKeyDown} 
                placeholder="Ask me about fashion, style, or upload an image..." 
                className={`w-full px-6 py-4 pr-24 bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-[#f4b06e] transition-all ${image ? 'pl-20' : 'pl-6'}`} 
              />
              <div className="absolute right-2 flex items-center space-x-2">
                <button 
                  onClick={() => fileInputRef.current.click()} 
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <Image className="w-6 h-6 text-secondary" />
                </button>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />
                <button 
                  onClick={generateAnswer} 
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <Send className="w-6 h-6 text-secondary" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-background p-4 flex items-center justify-center">
          <div className="w-full max-w-3xl mt-8 relative">
            <div className="text-2xl text-center font-bold mb-6 text-secondary">
              I'm your fashion advisor. Ask me anything about fashion!
            </div>

            <div className="relative flex flex-col items-center w-full">
              {/* Image Upload Section */}
              {image && (
                <div className="mb-4 flex items-center space-x-4 w-full max-w-md">
                  <div className="relative w-32 h-32">
                    <img 
                      src={image.preview} 
                      alt="Selected" 
                      className="w-full h-full rounded-lg object-cover border-2 border-gray-300 shadow-md" 
                    />
                    <button 
                      onClick={removeImage} 
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 truncate">
                    <p className="text-sm text-secondary font-medium truncate">{image.name}</p>
                  </div>
                </div>
              )}

              {/* Search Input Section */}
              <div className="relative flex-1 w-full">
                <input 
                  type="text" 
                  value={question} 
                  onChange={(e) => setQuestion(e.target.value)} 
                  onKeyDown={handleKeyDown} 
                  placeholder="Ask me about fashion..." 
                  className={`w-full px-6 py-4 pr-24 bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-[#4a3526] transition-all ${image ? 'pl-20' : 'pl-6'}`} 
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                  <button 
                    onClick={() => fileInputRef.current.click()} 
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <Image className="w-6 h-6 text-[#4a3526]" />
                  </button>
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    className="hidden" 
                  />
                  <button 
                    onClick={generateAnswer} 
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <Send className="w-6 h-6 text-[#4a3526]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;