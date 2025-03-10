/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Send, Menu } from "lucide-react";
import { motion } from "framer-motion";

// Updated import paths to resolve component issues
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function ChatbotUI() {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
  };

  return (
    <div className="flex h-screen w-full bg-gray-100">
      <div className="w-1/4 bg-white shadow-lg p-4 hidden md:block">
        <h2 className="text-xl font-semibold">LMI Chatbot</h2>
      </div>

      <div className="flex flex-col w-full md:w-3/4 p-4 relative">
        <header className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-t-lg">
          <h2 className="text-lg font-semibold">LMI Holdings Chatbot</h2>
          <Menu className="cursor-pointer" />
        </header>

        <Card className="flex flex-col flex-1 p-4 overflow-auto h-[75vh]">
          <CardContent className="space-y-4">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-[75%] p-3 rounded-lg text-white ${
                  msg.sender === "user" ? "bg-blue-600 self-end" : "bg-gray-700 self-start"
                }`}
              >
                {msg.text}
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <div className="flex items-center p-4 bg-white rounded-b-lg shadow-md">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg"
          />
          <Button onClick={sendMessage} className="ml-2 bg-blue-600 text-white rounded-lg">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
