import React, { useState } from "react";
import Chat from "./Chat";
import CodeSandbox from "./CodeSandbox";
import VoiceChat from "./VoiceChat";
import { languageOptions } from "../constants/languageOptions";
import ChatContext from "../utils/chatContext";
import styled, { keyframes } from "styled-components";
import { useSpring, animated } from "react-spring";



const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #1f2937; /* changed to a dark navy blue */
  // color: #f9fafb; /* changed to the previous background color for contrast */
`;

const Form = styled.form`
  background-color: #f9fafb;
  padding: 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 15px;
  width: 100%;
  max-width: 450px;
  display: grid;
  grid-gap: 2rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h1`
  text-align: center;
  color: #1f2937;
  font-weight: 600;
  font-size: 2rem;
  letter-spacing: -1px;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  text-align: center;
  color: #4b5563;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.5;
`;

const Input = styled.select`
  border: none;
  border-bottom: 1px solid #d1d5db;
  padding: 0.75rem;
  width: 100%;
  box-sizing: border-box;
  transition: border-bottom-color 0.3s ease-in-out;
  &:focus {
    border-bottom-color: #3b82f6;
    outline-color: #3b82f6;
  }
  background-color: #f9fafb;
  color: #111827;
`;

const Button = styled.button`
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 15px;
  color: #f9fafb;
  background-color: #3b82f6;
  cursor: pointer;
  width: 100%;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  transition: background-color 0.3s;
  &:hover {
    background-color: #2563eb;
    animation: 2s ${pulse} infinite;
  }
  &:disabled {
    background-color: #d1d5db;
  }
`;


const NewSession = ({ session }) => {
  const [messages, setMessages] = useState([]);
  const [sessionType, setSessionType] = useState("chat");
  const [difficulty, setDifficulty] = useState("easy");
  const [language, setLanguage] = useState({
    id: 63,
    name: "JavaScript (Node.js 12.14.0)",
    label: "JavaScript (Node.js 12.14.0)",
    value: "javascript",
  });
  const [chatSession, setChatSession] = useState(null);
  const userName = session.user.identities[0].identity_data.name;

  const startSession = (event) => {
    event.preventDefault();
    // if (!!sessionType && !!difficulty && !!language) {
    setChatSession({
      type: sessionType,
      difficulty: difficulty,
      language: language,
    });
    // }
  };

  const animation = useSpring({
    from: { opacity: 0, transform: "translate3d(0,40px,0)" },
    to: { opacity: 1, transform: "translate3d(0,0px,0)" },
    delay: 300,
    config: { mass: 1, tension: 280, friction: 60 },
  });


  return (
    <ChatContext.Provider value={{ messages, setMessages }}>
      <Wrapper>
        <animated.div style={animation}>
          {chatSession ? (
            <div className="flex">
              {sessionType === "chat" ? (
                <div className="chat interview screen">
                  <Chat session={session} chatSession={chatSession} />
                  <CodeSandbox chatSession={chatSession} language={language} />
                </div>
              ) : (
                <div className="chat interview screen">
                  <VoiceChat session={session} chatSession={chatSession} />
                  <CodeSandbox chatSession={chatSession} language={language} />
                </div>
              )}
            </div>
          ) : (
            <Form onSubmit={startSession}>
              <Title>Welcome {userName}</Title>
              <Description>
                What type of session would you like to start?
              </Description>
              <div>
                <Input
                  id="sessionType"
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                >
                  <option value="">Select Session Type</option>
                  <option value="chat">Chat</option>
                  <option value="voice">Voice</option>
                </Input>
              </div>
              <div>
                <Input
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="">Select Difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </Input>
              </div>
              <div>
                <Input
                  id="language"
                  value={language.value}
                  onChange={(e) =>
                    setLanguage(
                      languageOptions.find((opt) => opt.value === e.target.value)
                    )
                  }
                >
                  <option value="">Select Language</option>
                  {languageOptions.map((lang) => (
                    <option key={lang.id} value={lang.value}>
                      {lang.name}
                    </option>
                  ))}
                </Input>
              </div>
              <Button type="submit">Start Session</Button>
            </Form>
          )}
        </animated.div>
      </Wrapper>
    </ChatContext.Provider>
  );
};

export default NewSession;
