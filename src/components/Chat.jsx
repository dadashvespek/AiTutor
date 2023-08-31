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
import { classnames } from "../utils/general";
function formatLanguage(string) {
  switch (string.toLowerCase()) {
    case 'cpp':
      return 'C++';
    case 'sql':
      return 'SQL';
    case 'php':
      return 'PHP';
    default:
      return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

function Chat({ session, chatSession }) {
  const { messages, setMessages } = useContext(ChatContext);
  const [newMessage, setNewMessage] = useState("");
  const chatContainer = useRef(null);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [processedMessages, setProcessedMessages] = useState([]);

  const userName = session.user.identities[0].identity_data.name;

  function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  
  const properUserName = userName.split(' ').map(capitalizeFirstLetter).join(' ');
  

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
        if(isFirstMessage) {
        setIsFirstMessage(false);
    }
    if (isCodeMessage) {

      if (messages.length > 0 && messages[messages.length - 1].message === message) {
          return;
      }
  
      setMessages([...messages, loadingMessage]);
  }
  
    if (isCodeMessage) setMessages([...messages, loadingMessage]);
    if (!isFirstMessage) {
      setMessages([...messages, userMessage, loadingMessage]);
  } else {
      setIsFirstMessage(false); // Set it to false now that the first message is being processed.
      setMessages([...messages, loadingMessage]); // Only add the loading message
  }
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
    const message = newMessage
    setNewMessage("");
    await sendMessage(message);
  };

  useEffect(() => {
    if (chatContainer.current) {
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (messages.length > 1 && !lastMessage.isAI && !processedMessages.includes(lastMessage)) {
        sendMessage(lastMessage.message, true);
        setProcessedMessages(prevProcessed => [...prevProcessed, lastMessage]);
    }
}, [messages]);


  const sendWelcomeMessage = (() => {
    let hasSentWelcomeMessage = false;

    return (chatSession, sendMessage, messages) => {
      if (chatSession && messages.length === 0 && !hasSentWelcomeMessage) {
        const welcomeMessage = generateCodeMessage(
          `FIRST |${properUserName}|${formatLanguage(chatSession.language.value)}|${chatSession.difficulty}`

          );
        sendMessage(welcomeMessage.message);
        hasSentWelcomeMessage = true;
      }
    };
  })();

  useEffect(() => {
    sendWelcomeMessage(chatSession, sendMessage, messages);
  }, [chatSession, sendMessage, messages]);


  return (
    <div className="w-1/2 flex flex-col h-[88vh] justify-between">
      <div id="chat_container" className="overflow-auto" ref={chatContainer}>
      {messages.map((message, index) => (
    (index !== 0 || !isFirstMessage) && <Message key={index} messageData={message} />
))}
      </div>
      <form className="rounded-md" onSubmit={handleSubmit}>
    <textarea
        name="prompt"
        rows="1"
        cols="1"
        placeholder="Type Anything..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
            }
        }}
        style={{ overflow: 'hidden', resize: 'none' }}
    />
    <div className="flex flex-row space-x-4 items-start">
        <button
            type="submit"
            className={classnames(
                "border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
                !messages ? "opacity-50" : ""
            )}
        >
            Send
        </button>
    </div>
</form>

    </div>
  );
}

export default Chat;
