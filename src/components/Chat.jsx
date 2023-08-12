// Chat.js

import React, { useState, useEffect, useRef, useContext } from "react";
import ChatContext from "../utils/ChatContext";
import Message from "./Message";
import {
  generateCodeMessage,
  generateUniqueId,
  loadingEffect,
  typingEffect,
} from "../utils/chatUtils";

function Chat({ session, chatSession }) {
  const { messages, setMessages } = useContext(ChatContext);
  const [newMessage, setNewMessage] = useState("");
  const chatContainer = useRef(null);

  const userName = session.user.identities[0].identity_data.name;

  useEffect(() => {
    console.log("messages", messages);
  }, [messages]);

  const sendMessage = async (message, isCodeMessage) => {
    const userMessage = { isAI: false, message: message, isTyping: false };
    const loadingMessage = {
      isAI: true,
      message: "",
      id: generateUniqueId(),
      isTyping: true,
    };

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
      console.log("server url", import.meta.env.VITE_SERVER_URL)
      const response = await fetch(import.meta.env.VITE_SERVER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: message,
          chatSession: chatSession,
          session: session,
          userName: userName,
        }),
      });

      if (response.ok) {
        clearInterval(loadingEffectTimer);
        const data = await response.json();
        const parsedData = data.bot.trim();
        const uniqueId = generateUniqueId();
        const botMessage = {
          isAI: true,
          message: "",
          id: uniqueId,
          isTyping: true,
        };
        setMessages((prevMessages) =>
          prevMessages
            .filter((msg) => msg.id !== loadingMessage.id)
            .concat(botMessage)
        );
        typingEffect(parsedData, (typedText) => {
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === uniqueId
                ? { ...msg, message: typedText, isTyping: false }
                : msg
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
    if (messages.length > 1 && !messages[messages.length - 1].isAI) {
      sendMessage(messages[messages.length - 1].message, true);
    }
  }, [messages]);

  const sendWelcomeMessage = (() => {
    let hasSentWelcomeMessage = false;

    return (chatSession, sendMessage, messages) => {
      if (chatSession && messages.length === 0 && !hasSentWelcomeMessage) {
        const welcomeMessage = generateCodeMessage(
          `i want you to act as a software engineer interview coach. you will ask me a ${chatSession.difficulty} ${chatSession.language.name} problem, i will provide my code and the ouput in the next prompt, and then we will discuss it after that. my name is ${userName}. lets start!`
        );
        sendMessage(welcomeMessage.message);
        hasSentWelcomeMessage = true;
      }
    };
  })();

  useEffect(() => {
    sendWelcomeMessage(chatSession, sendMessage, messages);
  }, [chatSession, sendMessage, messages]);

  const resetChat = async () => {
    setMessages([]); // Clear frontend messages
    try {
      // Send the reset flag to the backend
      const response = await fetch(import.meta.env.VITE_SERVER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt:`i want you to act as a software engineer interview coach. you will ask me a ${chatSession.difficulty} ${chatSession.language.name} problem, i will provide my code and the ouput in the next prompt, and then we will discuss it after that. my name is ${userName}. lets start!`
          ,
          reset: true // signal to the backend to reset
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        // Process the response from the backend and add the bot's response to the messages
      } else {
        const err = await response.text();
        console.error(err);
        alert("Failed to reset chat!");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to reset chat!");
    }
  };
  
  
  
  
  
  

  return (
    <div className="w-1/2 flex flex-col h-[80vh] justify-between">
      <div id="chat_container" className="overflow-auto" ref={chatContainer}>
        {messages.map((message, index) => (
          <Message key={index} messageData={message} />
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
        <button onClick={(e) => { e.preventDefault(); resetChat(); }}>Reset Chat</button>

      </form>
    </div>
  );
}

export default Chat;
