import React, { useState } from "react";
import Chat from "./Chat";
import CodeSandbox from "./CodeSandbox";
import VoiceChat from "./VoiceChat";

const NewSession = ({ session }) => {
  const [sessionType, setSessionType] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [language, setLanguage] = useState("");
  const [chatSession, setChatSession] = useState(null);

  const startSession = (event) => {
    event.preventDefault();
    setChatSession({
      type: sessionType,
      difficulty: difficulty,
      language: language,
    });
  };

  return (
    <div>
      {chatSession ? (
        <div className="flex">
          {/* <div className="chat interview screen"> */}
          <Chat session={session} chatSession={chatSession} />
          <CodeSandbox />
          {/* </div> */}
          {/* <VoiceChat session={session} chatSession={chatSession} /> */}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <form
            onSubmit={startSession}
            className="flex flex-col space-y-2 w-1/3 rounded "
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
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="">Select Language</option>
              <option value="python">Python</option>
              <option value="c++">C++</option>
              <option value="javascript">JavaScript</option>
            </select>
            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Start Session
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default NewSession;
