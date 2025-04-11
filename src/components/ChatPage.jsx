import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Send, Menu, Sun, Moon, LogOut, Loader, Trash2, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "./Card";
import { Button } from "./Button";
import { Input } from "./Input";
import LmiLogo from "./assets/lmi-logo.jpg";
import axios from "axios";

export default function ChatbotUI() {
  const { chatId: urlChatId } = useParams();
  const [chats, setChats] = useState([]); // List of all chats
  const [currentChatId, setCurrentChatId] = useState(null); // Current active chat
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
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

  const token = sessionStorage.getItem("token"); // JWT token from auth

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Dark mode handling
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check authentication and fetch all chats
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("authenticated");
    if (!isAuthenticated || !token) {
      navigate("/", { replace: true });
      return;
    }

    // Fetch all chats on mount
    const fetchChats = async () => {
      console.log(token)
      try {
        const response = await axios.get("http://localhost:3000/api/chats/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChats(response.data);
        console.log('fetched chats: ', response.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    fetchChats();
  }, [navigate, token]);

  // Load chat from URL chatId on mount or when urlChatId changes
  useEffect(() => {
    if (urlChatId) {
      setCurrentChatId(urlChatId);
      loadChat(urlChatId);
    } else {
      setCurrentChatId(null);
      setMessages([]); // Reset messages for new chat
    }
  }, [urlChatId]);

  // Start a new chat
  const startNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    setInput("");
    navigate("/chat", { replace: true }); // Reset URL to /chat
  };
  
  const sendMessage = async (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage = { content: trimmedInput, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      let chatId = currentChatId;

      if (!chatId) {
        const newChatResponse = await axios.post(
          "http://localhost:3000/api/chats/new",
          { initialMessage: trimmedInput, sender: "user" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        chatId = newChatResponse.data.chat._id;
        setCurrentChatId(chatId);
        setChats((prev) => [...prev, newChatResponse.data.chat]);
        navigate(`/chat/${chatId}`); // Update URL with new chat ID
      } else {
        await axios.post(
          "http://localhost:3000/api/chats/append",
          { chatId, message: trimmedInput, sender: "user" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      const botResponse = await axios.post(
        "https://pfrimpong-hr-policy-bot.hf.space/ask",
        { text: trimmedInput },
        { headers: { "Content-Type": "application/json" } }
      );
      const botMessage = { content: botResponse.data.answer, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);

      await axios.post(
        "http://localhost:3000/api/chats/append",
        { chatId, message: botResponse.data.answer, sender: "bot" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { content: "Sorry, something went wrong. Please try again.", sender: "bot" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadChat = async (chatId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/chats/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentChatId(chatId);
      setMessages(response.data.messages);
      navigate(`/chat/${chatId}`); // Update URL when loading a chat
    } catch (error) {
      console.error("Error loading chat:", error);
    }
  };

  // Edit chat title (example implementation)
  const editChatTitle = async (chatId, newTitle) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/chats/${chatId}`,
        { title: newTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChats((prev) =>
        prev.map((chat) => (chat._id === chatId ? response.data : chat))
      );
    } catch (error) {
      console.error("Error editing chat title:", error);
    }
  };

  // Delete a chat
const deleteChat = async (chatId) => {
    try {
      await axios.delete(`http://localhost:3000/api/chats/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChats((prev) => prev.filter((chat) => chat._id !== chatId));
      if (currentChatId === chatId) {
        setCurrentChatId(null);
        setMessages([]);
        navigate("/chat", { replace: true }); // Reset URL after deletion
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/", { replace: true });
  };

  const formatMessage = (content) => {
    if (typeof content !== "string") {
      console.warn("Invalid message content:", content);
      return <p>Message content unavailable</p>;
    }
    return content.split("\n").map((line, i) => (
      <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>
    ));
  };

  return (
    <div
      className={`flex h-screen w-full transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50"
      }`}
    >
      {/* Sidebar */}
      <div
        className={`w-64 ${
          darkMode ? "bg-gray-800" : "bg-red-600"
        } shadow-lg p-4 flex flex-col text-white transition-all duration-300`}
      >
        <img src={LmiLogo} alt="LMI Logo" className="w-24 mx-auto mb-4 rounded-lg" />
        <h2 className="text-xl font-semibold text-center mb-4">LMI HR Assistant</h2>
        <Button
          onClick={startNewChat}
          className="w-full p-3 mb-4 rounded-lg hover:bg-opacity-20 hover:bg-black transition"
        >
          New Chat
        </Button>
        <div className="flex-1 overflow-y-auto space-y-2">
          {chats.map((chat) => (
            <div
              key={chat._id}
              className={`flex items-center justify-between p-2 rounded-lg ${
                currentChatId === chat._id ? "bg-opacity-30 bg-black" : ""
              } hover:bg-opacity-20 hover:bg-black transition`}
            >
              <button
                onClick={() => loadChat(chat._id)}
                className="flex-1 text-left truncate"
              >
                {chat.title || `Chat ${chat._id.slice(-6)}`}
              </button>
              <Button
                onClick={() => {
                  const newTitle = prompt("Enter new title:", chat.title);
                  if (newTitle) editChatTitle(chat._id, newTitle);
                }}
                className="p-1 hover:bg-opacity-10 hover:bg-gray-500"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => deleteChat(chat._id)}
                className="p-1 hover:bg-opacity-10 hover:bg-gray-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <Button
            onClick={toggleDarkMode}
            className="flex items-center w-full p-3 justify-center rounded-lg hover:bg-opacity-20 hover:bg-black transition"
          >
            {darkMode ? <Sun className="w-5 h-5 mr-2" /> : <Moon className="w-5 h-5 mr-2" />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>
          <Button
            onClick={handleLogout}
            className="flex items-center w-full p-3 justify-center rounded-lg hover:bg-opacity-20 hover:bg-black transition"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex flex-col flex-1 relative">
        {/* Header */}
        <header
          className={`flex items-center justify-between px-4 py-3 ${
            darkMode ? "bg-gray-800" : "bg-red-600"
          } text-white transition-colors duration-300`}
        >
          <div className="flex items-center space-x-2">
            <img src={LmiLogo} alt="LMI Logo" className="w-8 h-8 rounded" />
            <h2 className="text-lg font-semibold">LMI HR Assistant</h2>
          </div>
          <div className="md:hidden" ref={menuRef}>
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
                  className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${
                    darkMode ? "bg-gray-800" : "bg-white text-gray-800"
                  } p-2 z-10`}
                >
                  <Button
                    onClick={toggleDarkMode}
                    className="flex items-center w-full p-3 text-sm rounded-md hover:bg-opacity-10 hover:bg-gray-500"
                  >
                    {darkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                    {darkMode ? "Light Mode" : "Dark Mode"}
                  </Button>
                  <Button
                    onClick={handleLogout}
                    className="flex items-center w-full p-3 text-sm text-red-600 rounded-md hover:bg-opacity-10 hover:bg-gray-500"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Chat Messages */}
        <Card
          className={`flex flex-col flex-1 p-2 sm:p-4 overflow-hidden ${
            darkMode ? "bg-gray-800" : "bg-gray-100"
          } transition-colors duration-300`}
        >
          <CardContent className="space-y-4 overflow-y-auto h-full pb-4">
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`max-w-[85%] sm:max-w-[70%] p-4 rounded-2xl shadow-md relative group ${
                    msg.sender === "user"
                      ? `${darkMode ? "bg-red-700" : "bg-red-600"} text-white self-end ml-auto 
                        before:content-[''] before:absolute before:bottom-0 before:right-[-8px] 
                        before:border-8 before:border-transparent before:border-l-red-600 
                        ${darkMode ? "before:border-l-red-700" : "before:border-l-red-600"}`
                      : `${darkMode ? "bg-gray-700" : "bg-white"} ${
                          darkMode ? "text-white" : "text-gray-800"
                        } self-start 
                        before:content-[''] before:absolute before:bottom-0 before:left-[-8px] 
                        before:border-8 before:border-transparent before:border-r-gray-700 
                        ${darkMode ? "before:border-r-gray-700" : "before:border-r-white"}`
                  } hover:shadow-lg transition-shadow duration-200`}
                >
                  {msg.sender === "bot" && (
                    <div className="absolute -top-3 left-3">
                      <img
                        src={LmiLogo}
                        alt="LMI Logo"
                        className="w-6 h-6 rounded-full border-2 border-gray-500"
                      />
                    </div>
                  )}
                  <div className={`break-words ${msg.sender === "bot" ? "mt-2" : ""}`}>
                    {formatMessage(msg.content)}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`max-w-[85%] sm:max-w-[70%] p-4 rounded-2xl shadow-md self-start 
                    ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"} 
                    before:content-[''] before:absolute before:bottom-0 before:left-[-8px] 
                    before:border-8 before:border-transparent before:border-r-gray-700 
                    ${darkMode ? "before:border-r-gray-700" : "before:border-r-white"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="absolute -top-3 left-3">
                      <img
                        src={LmiLogo}
                        alt="LMI Logo"
                        className="w-6 h-6 rounded-full border-2 border-gray-500"
                      />
                    </div>
                    <div className="typing-animation mt-2">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </div>
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
          className={`flex items-center p-3 ${
            darkMode ? "bg-gray-900" : "bg-white"
          } rounded-b-lg shadow-md border-t ${
            darkMode ? "border-gray-700" : "border-gray-200"
          } transition-colors duration-300`}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className={`flex-1 p-3 rounded-lg ${
              darkMode
                ? "bg-gray-800 text-white border-gray-700"
                : "bg-gray-100 text-gray-800 border-gray-300"
            } focus:ring-2 focus:ring-red-500 transition`}
            disabled={isLoading}
            required
          />
          <Button
            type="submit"
            className={`ml-2 ${
              darkMode ? "bg-red-700" : "bg-red-600"
            } hover:bg-red-700 text-white rounded-lg px-4 py-3 transition disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </form>
      </div>
    </div>
  );
}