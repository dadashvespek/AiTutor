import React, { useState, useEffect, useRef } from "react";
import bot from "../assets/bot.svg";
import user from "../assets/user.svg";

function Chat({ session }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  console.log(session);

  const chatContainer = useRef(null);

  const generateUniqueId = () => {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);
    return `id-${timestamp}-${hexadecimalString}`;
  };

  const typingEffect = (text, callback) => {
    let index = 0;
    let message = "";
    let timerID = setInterval(() => {
      if (index < text.length) {
        message += text.charAt(index);
        callback(message);
        index++;
      } else {
        clearInterval(timerID);
      }
    }, 15); // Speed of typing effect
  };

  const loadingEffect = (callback) => {
    let dotCount = 0;
    let timerID = setInterval(() => {
      let dots = ".".repeat(dotCount);
      callback(`${dots}`);
      dotCount = (dotCount + 1) % 4;
    }, 200); // Speed of loading effect
    return timerID;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userMessage = { isAI: false, message: newMessage };
    const loadingMessage = { isAI: true, message: "", id: generateUniqueId() };
    setMessages([...messages, userMessage, loadingMessage]);
    setNewMessage("");

    let loadingEffectTimer = loadingEffect((loadingText) => {
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.id === loadingMessage.id
            ? { ...message, message: loadingText }
            : message
        )
      );
    });

    try {
      const response = await fetch("http://localhost:5000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: newMessage }),
      });

      if (response.ok) {
        clearInterval(loadingEffectTimer);
        const data = await response.json();
        const parsedData = data.bot.trim(); // trims any trailing spaces/'\n'
        const uniqueId = generateUniqueId();
        const botMessage = { isAI: true, message: "", id: uniqueId };
        setMessages((prevMessages) =>
          prevMessages
            .filter((message) => message.id !== loadingMessage.id)
            .concat(botMessage)
        );
        typingEffect(parsedData, (typedText) => {
          setMessages((prevMessages) =>
            prevMessages.map((message) =>
              message.id === uniqueId
                ? { ...message, message: typedText }
                : message
            )
          );
        });
      } else {
        clearInterval(loadingEffectTimer);
        const err = await response.text();
        console.error(err);
        alert("Something went wrong!");
      }
    } catch (error) {
      clearInterval(loadingEffectTimer);
      console.error(error);
      alert("Something went wrong!");
    }
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
