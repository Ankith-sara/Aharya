import React, { useState, useEffect, useRef } from "react";
import { Send, Image, X, BotMessageSquare } from "lucide-react";

const ChatBot = () => {
  const [question, setQuestion] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [image, setImage] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyA4jOuoOcaGxCT_zQ8TDVpA_XQyUyLFCTs";

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
    <div className="flex flex-col min-h-screen bg-white">
      {showChat ? (
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 sm:px-6 md:px-10 lg:px-20 py-10 mt-20">
          <div className="text-3xl text-center mb-8 flex items-center justify-center gap-2">
            <BotMessageSquare className="w-8 h-8" />
            <div className="font-light tracking-wide">FASHION <span className="font-semibold">ADVISOR</span></div>
          </div>

          {/* Chat Log Container */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto rounded-lg shadow-sm border border-gray-200 mb-6 space-y-4 p-6" style={{ minHeight: '400px', maxHeight: '60vh' }}>
            {chatLog.map((entry, index) => (
              <div key={index} className={`flex ${entry.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`p-4 rounded-lg max-w-md shadow-sm ${entry.sender === "user" ? "bg-black text-white" : "bg-white text-gray-900 border border-gray-200"}`}>
                  {entry.image && (
                    <div className="mb-3">
                      <img src={entry.image.preview} alt="Uploaded" className="w-full rounded-md object-cover" />
                    </div>
                  )}
                  <p className="whitespace-pre-wrap text-sm">{entry.text}</p>
                </div>
              </div>
            ))}
            {chatLog.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
                <BotMessageSquare className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-center text-sm">Start a conversation about fashion or upload an image for style advice</p>
              </div>
            )}
          </div>

          {/* Input Section */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            {/* Image Upload Section */}
            {image && (
              <div className="mb-4 flex items-center gap-4">
                <div className="relative w-20 h-20">
                  <img src={image.preview} alt="Selected" className="w-full h-full rounded-md object-cover border border-gray-300" />
                  <button onClick={removeImage} className="absolute -top-2 -right-2 bg-black text-white p-1 rounded-full hover:bg-gray-800 shadow-sm">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 truncate">
                  <p className="text-xs text-gray-600 font-medium truncate">{image.name}</p>
                </div>
              </div>
            )}

            {/* Search Input Section */}
            <div className="relative flex items-center">
              <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ask me about fashion or style..." className="w-full px-4 py-3 pr-24 rounded-md border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" />
              <div className="absolute right-2 flex items-center space-x-2">
                <button onClick={() => fileInputRef.current.click()} className="p-2 hover:bg-gray-100 rounded-full transition">
                  <Image className="w-5 h-5 text-gray-600" />
                </button>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                <button onClick={generateAnswer} className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-10 lg:px-20 py-20">
          <div className="w-full max-w-3xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-light mb-3 tracking-wide">FASHION <span className="font-semibold">ADVISOR</span></h1>
              <p className="text-gray-600 max-w-xl mx-auto">Upload images or ask questions about fashion, style, trends, and outfit recommendations.</p>
            </div>

              {/* Image Upload Section */}
              {image && (
                <div className="mb-6 flex items-center gap-4">
                  <div className="relative w-24 h-24">
                    <img src={image.preview} alt="Selected" className="w-full h-full rounded-md object-cover border border-gray-300" />
                    <button onClick={removeImage} className="absolute -top-2 -right-2 bg-black text-white p-1 rounded-full hover:bg-gray-800 shadow-sm">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 truncate">
                    <p className="text-sm text-gray-600 font-medium truncate">{image.name}</p>
                  </div>
                </div>
              )}

              {/* Search Input Section */}
              <div className="relative">
                <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ask me about fashion or upload an image..." className="w-full px-4 py-4 pr-24 rounded-md border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                  <button onClick={() => fileInputRef.current.click()} className="p-2 hover:bg-gray-100 rounded-full transition">
                    <Image className="w-5 h-5 text-gray-600" />
                  </button>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                  <button onClick={generateAnswer} className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;