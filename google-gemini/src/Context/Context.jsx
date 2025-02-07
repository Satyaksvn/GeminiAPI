import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);

  let timeoutIds = [];
  let currentWords = [];

  // ✅ Fix: Smooth & natural typing effect
  const delayTyping = (index) => {
    if (index >= currentWords.length) return; // Stop at last word

    let nextWord = currentWords[index];

    // ✅ Fix: Move to a new line if word starts with '*'
    if (nextWord.startsWith("*")) {
      setResultData((prev) => prev + "<br/>");
      nextWord = nextWord.replace("*", ""); // Remove *
    }

    // ✅ Fix: Character-by-character smooth typing
    let chars = nextWord.split("");
    chars.forEach((char, i) => {
      const timeoutId = setTimeout(() => {
        if (!isPaused) {
          setResultData((prev) => prev + char);
        }
      }, i * 15); // ⏳ Adjust typing speed
      timeoutIds.push(timeoutId);
    });

    // ✅ Move to next word after a delay
    const nextTimeout = setTimeout(() => {
      if (!isPaused) {
        setResultData((prev) => prev + " ");
        setTypingIndex(index + 1); // ✅ Store paused position
        delayTyping(index + 1);
      }
    }, chars.length * 15 + 50);
    timeoutIds.push(nextTimeout);
  };

  // ✅ Fix: Pause button actually works
  const pauseTyping = () => {
    setIsPaused(true);
    timeoutIds.forEach(clearTimeout);
  };

  // ✅ Fix: Resume continues smoothly
  const resumeTyping = () => {
    setIsPaused(false);
    delayTyping(typingIndex);
  };

  // ✅ Fix: Sending message properly
  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    setIsPaused(false);
    setTypingIndex(0);
    timeoutIds = [];

    let response;
    if (prompt !== undefined) {
      response = await runChat(prompt);
      setRecentPrompt(prompt);
    } else {
      setPrevPrompts((prev) => [...prev, input]);
      setRecentPrompt(input);
      response = await runChat(input);
    }

    // ✅ Fix: Formatting issues
    response = response.replace(/\*\*/g, ""); // Remove stars
    response = response.replace(/\. /g, ".<br/><br/>"); // New line after full stop
    response = response.replace(/\s+/g, " "); // Remove extra spaces

    // ✅ Start smooth printing
    currentWords = response.split(" ");
    delayTyping(0);

    setLoading(false);
    setInput("");
  };

  // ✅ Fix: Reset chat
  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setResultData("");
    setRecentPrompt("");
    timeoutIds.forEach(clearTimeout);
  };

  const contextValue = {
    input,
    setInput,
    recentPrompt,
    setRecentPrompt,
    prevPrompts,
    setPrevPrompts,
    showResult,
    loading,
    resultData,
    onSent,
    newChat,
    pauseTyping,
    resumeTyping,
    isPaused,
  };

  return <Context.Provider value={contextValue}>{props.children}</Context.Provider>;
};

export default ContextProvider;
