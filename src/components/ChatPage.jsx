/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useEffect } from "react";
import { Send, Menu, Sun, Moon, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "./Card";
import { Button } from "./Button";
import { Input } from "./Input";
import { useNavigate } from "react-router-dom";
import LmiLogo from "./assets/lmi-logo.jpg"; // Ensure LMI logo is in the assets folder

export default function ChatbotUI() {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // const sendMessage = (e) => {
  //   e.preventDefault(); // Prevents page reload when form is submitted
  //   if (!input.trim()) return;
  //   setMessages([...messages, { text: input, sender: "user" }]);
  //   setInput("");
  // };

  const sendMessage = async (e) => {
    e.preventDefault(); //Prevents page reload when form is submitted
    if (!input.trim()) return;
  
    // Show user message
    setMessages([...messages, { text: input, sender: "user" }]);
  
    // Send question to backend
    try {
      // const response = await fetch("http://localhost:5000/chatbot", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ question: input }),
      // });
      const response = await fetch("https://chatbot-backend-hr7i.onrender.com/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      
  
      const data = await response.json();
      setMessages([...messages, { text: input, sender: "user" }, { text: data.response, sender: "bot" }]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
    }
  
    setInput(""); // Clear input field
  };
  

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/"); // Redirects to sign-in page on logout
  };

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("authenticated");
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className={`flex h-screen w-full ${darkMode ? "bg-gray-900 text-white" : "bg-white"}`}>
      {/* Sidebar - Hidden on smaller screens */}
      <div className={`w-1/4 ${darkMode ? "bg-gray-800" : "bg-red-600"} shadow-lg p-4 hidden md:block text-white`}>
        <img src={LmiLogo} alt="LMI Logo" className="w-24 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-center">LMI Chatbot</h2>
      </div>

      {/* Chat Section */}
      <div className="flex flex-col w-full md:w-3/4 p-4 relative">
        {/* Header with LMI Logo */}
        <header className={`flex items-center justify-between p-4 ${darkMode ? "bg-gray-800" : "bg-red-600"} text-white rounded-t-lg`}>
          <div className="flex items-center space-x-2">
            <img src={LmiLogo} alt="LMI Logo" className="w-8 h-8" />
            <h2 className="text-lg font-semibold">LMI Holdings Chatbot</h2>
          </div>

          {/* Menu Button */}
          <div className="relative">
            <Menu className="cursor-pointer" onClick={() => setMenuOpen(!menuOpen)} />
            {menuOpen && (
              <div className={`absolute right-0 mt-2 w-40 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-black"} p-2`}>
                <Button onClick={toggleDarkMode} className="flex items-center w-full p-2 text-sm">
                  {darkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </Button>
                <Button onClick={handleLogout} className="flex items-center w-full p-2 text-sm text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </header>

        {/* Chat Messages */}
        <Card className={`flex flex-col flex-1 p-4 overflow-auto h-[75vh] ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
          <CardContent className="space-y-4">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-max p-3 rounded-lg flex items-center space-x-2 shadow-md ${
                  msg.sender === "user"
                    ? `${darkMode ? "bg-red-700" : "bg-red-600"} text-white self-end ml-auto`
                    : `${darkMode ? "bg-gray-600 text-white" : "bg-white text-black"} self-start flex-row`
                }`}
              >
                {msg.sender === "bot" && (
                  <img src={LmiLogo} alt="LMI Logo" className="w-6 h-6" />
                )}
                <span>{msg.text}</span>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Input Section - Now wrapped in a <form> */}
        <form onSubmit={sendMessage} className={`flex items-center p-4 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-b-lg shadow-md border-t`}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg"
            required
          />
          <Button type="submit" className="ml-2 bg-red-600 text-white rounded-lg px-4 py-2">
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
