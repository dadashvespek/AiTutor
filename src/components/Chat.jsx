import React, { useState, useEffect, useRef, useContext } from "react";
import bot from "../assets/bot.svg";
import user from "../assets/user.svg";
import ChatContext from "../utils/chatContext";
import {
  generateUniqueId,
  loadingEffect,
  typingEffect,
} from "../utils/chatUtils";

function Chat({ session }) {
  const { messages, setMessages } = useContext(ChatContext);
  const [newMessage, setNewMessage] = useState("");

  const chatContainer = useRef(null);

  const sendMessage = async (message, isCodeMessage) => {
    const userMessage = { isAI: false, message: message };
    const loadingMessage = { isAI: true, message: "", id: generateUniqueId() };

    if (isCodeMessage) setMessages([...messages, loadingMessage]);
    else setMessages([...messages, userMessage, loadingMessage]);

    let loadingEffectTimer = loadingEffect((loadingText) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === loadingMessage.id ? { ...msg, message: loadingText } : msg
        )
      );
    });

    try {
      const response = await fetch("http://localhost:5000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: message }),
      });

      if (response.ok) {
        clearInterval(loadingEffectTimer);
        const data = await response.json();
        const parsedData = data.bot.trim();
        const uniqueId = generateUniqueId();
        const botMessage = { isAI: true, message: "", id: uniqueId };
        setMessages((prevMessages) =>
          prevMessages
            .filter((msg) => msg.id !== loadingMessage.id)
            .concat(botMessage)
        );
        typingEffect(parsedData, (typedText) => {
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === uniqueId ? { ...msg, message: typedText } : msg
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendMessage(newMessage);
    setNewMessage("");
  };

  useEffect(() => {
    if (chatContainer.current) {
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0 && !messages[messages.length - 1].isAI) {
      sendMessage(messages[messages.length - 1].message, true);
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
