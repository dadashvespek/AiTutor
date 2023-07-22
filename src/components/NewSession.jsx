import React, { useState } from "react";
import Chat from "./Chat";
import CodeSandbox from "./CodeSandbox";
import VoiceChat from "./VoiceChat";
import { languageOptions } from "../constants/languageOptions";
import ChatContext from "../utils/chatContext";

const NewSession = ({ session }) => {
  const [messages, setMessages] = useState([]);
  const [sessionType, setSessionType] = useState("chat");
  const [difficulty, setDifficulty] = useState("");
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

  return (
    <ChatContext.Provider value={{ messages, setMessages }}>
      <div>
        {chatSession ? (
          <div className="flex">
            {sessionType === "chat" ? (
              <div className="chat interview screen">
                <Chat session={session} chatSession={chatSession} />
                <CodeSandbox language={language} />
              </div>
            ) : (
              <div className="chat interview screen">
              <VoiceChat session={session} chatSession={chatSession} />
              <CodeSandbox language={language} />
            </div>
              
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center min-h-screen w-1/3">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome {userName}
              </h1>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                What type of session would you like to start?
              </h2>
              <form
                onSubmit={startSession}
                className="flex flex-col space-y-2 rounded "
              >
                <label
                  htmlFor="sessionType"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Select Session Type
                </label>
                <select
                  id="sessionType"
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">Select Session Type</option>
                  <option value="chat">Chat</option>
                  <option value="voice">Voice</option>
                </select>
                <label
                  htmlFor="difficulty"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Select Difficulty
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">Select Difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <label
                  htmlFor="language"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Select Language
                </label>
                <select
                  id="language"
                  value={language.value}
                  onChange={(e) =>
                    setLanguage(
                      languageOptions.find(
                        (opt) => opt.value === e.target.value
                      )
                    )
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">Select Language</option>
                  {languageOptions.map((lang) => (
                    <option key={lang.id} value={lang.value}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Start Session
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </ChatContext.Provider>
  );
};

export default NewSession;
