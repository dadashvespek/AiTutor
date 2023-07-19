import React, { useState, useEffect, useRef } from "react";
import bot from "../assets/bot.svg";
import user from "../assets/user.svg";

function Chat() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const chatContainer = useRef(null);

  const generateUniqueId = () => {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);
    return `id-${timestamp}-${hexadecimalString}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userMessage = { isAI: false, message: newMessage };
    const uniqueId = generateUniqueId();
    const botMessage = { isAI: true, message: "", id: uniqueId };
    setMessages([...messages, userMessage, botMessage]);

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: newMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim(); // trims any trailing spaces/'\n'
        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            message.id === uniqueId
              ? { ...message, message: parsedData }
              : message
          )
        );

        setLoading(false);
      } else {
        const err = await response.text();
        console.error(err);
        alert("Something went wrong!");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
    setNewMessage("");
  };

  useEffect(() => {
    if (chatContainer.current) {
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-1/2 flex flex-col h-screen justify-between">
      <div id="chat_container" className="overflow-auto" ref={chatContainer}>
        {messages.map((message, index) => (
          <div className={`wrapper ${message.isAI ? "ai" : ""}`} key={index}>
            <div className="chat">
              <div className="profile">
                <img
                  src={message.isAI ? bot : user}
                  alt={message.isAI ? "bot" : "user"}
                />
              </div>
              <div className="message">{message.message}</div>
            </div>
          </div>
        ))}
        {loading && <div>Loading...</div>}
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          name="prompt"
          rows="1"
          cols="1"
          placeholder="Type Anything..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;
