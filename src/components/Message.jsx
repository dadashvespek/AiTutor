import React, { useState, useEffect } from "react";
import bot from "../assets/bot.svg";
import user from "../assets/user.svg";
import { typingEffect } from "../utils/chatUtils";

function Message({ messageData }) {
  const [displayMessage, setDisplayMessage] = useState("");

  useEffect(() => {
    if (messageData.isTyping) {
      typingEffect(messageData.message, setDisplayMessage);
    } else {
      setDisplayMessage(messageData.message);
    }
  }, [messageData]);

  return (
    <div className={`rounded-md wrapper ${messageData.isAI ? "ai" : ""}`}>
      <div className="chat">
        <div className="profile">
          <img
            src={messageData.isAI ? bot : user}
            alt={messageData.isAI ? "bot" : "user"}
          />
        </div>
        <div className="message">{displayMessage}</div>
      </div>
    </div>
  );
}

export default Message;
