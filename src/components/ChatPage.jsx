/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { Send, Menu, Sun, Moon, LogOut, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "./Card";
import { Button } from "./Button";
import { Input } from "./Input";
import { useNavigate } from "react-router-dom";
import LmiLogo from "./assets/lmi-logo.jpg";
import axios from "axios";

export default function ChatbotUI() {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    // Get saved preference from localStorage or default to system preference
    const savedMode = localStorage.getItem("darkMode");
    return savedMode !== null 
      ? JSON.parse(savedMode) 
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const menuRef = useRef(null);

  // Scroll to bottom of messages when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    // Apply dark mode class to document body
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Check authentication
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("authenticated");
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;
    
    // Add user message to chat
    setMessages(prevMessages => [...prevMessages, { text: trimmedInput, sender: "user" }]);
    setInput("");
    setIsLoading(true);
  
    try {
      console.log('Sending question to backend:', trimmedInput);
      const response = await axios.post("https://pfrimpong-hr-policy-bot.hf.space/ask", {
        text: trimmedInput,
      }, {
        headers: { "Content-Type": "application/json" },
      });

      const answer = response.data.answer;
      
      // Add bot response to chat
      setMessages(prevMessages => [...prevMessages, { text: answer, sender: "bot" }]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setMessages(prevMessages => [
        ...prevMessages, 
        { text: "Sorry, I'm having trouble connecting to the server. Please try again later.", sender: "bot" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  // Format message text with paragraph breaks
  const formatMessage = (text) => {
    return text.split('\n').map((line, i) => (
      <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>
    ));
  };

  return (
    <div className={`flex h-screen w-full transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50"}`}>
      {/* Sidebar - Hidden on mobile */}
      <div className={`w-0 md:w-1/4 lg:w-1/5 ${darkMode ? "bg-gray-800" : "bg-red-600"} shadow-lg p-4 hidden md:flex flex-col items-center text-white transition-all duration-300`}>
        <img src={LmiLogo} alt="LMI Logo" className="w-24 mx-auto mb-4 rounded-lg" />
        <h2 className="text-xl font-semibold text-center mb-8">LMI HR Assistant</h2>
        
        {/* Sidebar menu items */}
        <div className="w-full space-y-2 mt-4">
          <Button onClick={toggleDarkMode} className="flex items-center w-full p-3 justify-center rounded-lg hover:bg-opacity-20 hover:bg-black transition">
            {darkMode ? <Sun className="w-5 h-5 mr-2" /> : <Moon className="w-5 h-5 mr-2" />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>
          <Button onClick={handleLogout} className="flex items-center w-full p-3 justify-center rounded-lg hover:bg-opacity-20 hover:bg-black transition mt-auto">
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex flex-col w-full md:w-3/4 lg:w-4/5 relative">
        {/* Header */}
        <header className={`flex items-center justify-between px-4 py-3 ${darkMode ? "bg-gray-800" : "bg-red-600"} text-white transition-colors duration-300`}>
          <div className="flex items-center space-x-2">
            <img src={LmiLogo} alt="LMI Logo" className="w-8 h-8 rounded" />
            <h2 className="text-lg font-semibold">LMI HR Assistant</h2>
          </div>

          {/* Menu Button */}
          <div className="relative" ref={menuRef}>
            <Button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="p-2 rounded-full hover:bg-opacity-20 hover:bg-black transition"
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <AnimatePresence>
              {menuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-white text-gray-800"} p-2 z-10`}
                >
                  <Button onClick={toggleDarkMode} className="flex items-center w-full p-3 text-sm rounded-md hover:bg-opacity-10 hover:bg-gray-500">
                    {darkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                    {darkMode ? "Light Mode" : "Dark Mode"}
                  </Button>
                  <Button onClick={handleLogout} className="flex items-center w-full p-3 text-sm text-red-600 rounded-md hover:bg-opacity-10 hover:bg-gray-500">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Chat Messages */}
        <Card className={`flex flex-col flex-1 p-2 sm:p-4 overflow-hidden ${darkMode ? "bg-gray-800" : "bg-gray-100"} transition-colors duration-300`}>
          <CardContent className="space-y-4 overflow-y-auto h-full pb-4">
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`max-w-[85%] sm:max-w-[75%] p-3 rounded-lg shadow-sm ${
                    msg.sender === "user"
                      ? `${darkMode ? "bg-red-700" : "bg-red-600"} text-white self-end ml-auto rounded-tr-none`
                      : `${darkMode ? "bg-gray-700" : "bg-white"} ${darkMode ? "text-white" : "text-gray-800"} self-start rounded-tl-none`
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {msg.sender === "bot" && (
                      <img src={LmiLogo} alt="LMI Logo" className="w-6 h-6 mt-1 rounded" />
                    )}
                    <div className="break-words">{formatMessage(msg.text)}</div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[85%] sm:max-w-[75%] p-3 rounded-lg shadow-sm self-start rounded-tl-none ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"}`}
                >
                  <div className="flex items-center gap-2">
                    <img src={LmiLogo} alt="LMI Logo" className="w-6 h-6 rounded" />
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </CardContent>
        </Card>

        {/* Input Form */}
        <form 
          onSubmit={sendMessage} 
          className={`flex items-center p-3 ${darkMode ? "bg-gray-900" : "bg-white"} rounded-b-lg shadow-md border-t ${darkMode ? "border-gray-700" : "border-gray-200"} transition-colors duration-300`}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className={`flex-1 p-3 rounded-lg ${darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-gray-100 text-gray-800 border-gray-300"} focus:ring-2 focus:ring-red-500 transition`}
            disabled={isLoading}
            required
          />
          <Button 
            type="submit" 
            className={`ml-2 ${darkMode ? "bg-red-700" : "bg-red-600"} hover:bg-red-700 text-white rounded-lg px-4 py-3 transition disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}