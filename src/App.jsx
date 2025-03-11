// /* eslint-disable no-unused-vars */
// import { useState } from "react";
// import { Send, Menu } from "lucide-react";
// import { motion } from "framer-motion";
// import { Card, CardContent } from "./components/Card";
// import { Button } from "./components/Button";
// import { Input } from "./components/Input";
// import LmiLogo from "./assets/lmi-logo.jpg"; // Ensure LMI logo is in the assets folder

// export default function ChatbotUI() {
//   const [messages, setMessages] = useState([
//     { text: "Hello! How can I assist you today?", sender: "bot" }
//   ]);
//   const [input, setInput] = useState("");

//   const sendMessage = () => {
//     if (!input.trim()) return;
//     const newMessages = [...messages, { text: input, sender: "user" }];
//     setMessages(newMessages);
//     setInput("");
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault(); // Prevent default behavior of Enter key
//       sendMessage();
//     }
//   };

//   return (
//     <div className="flex h-screen w-full bg-white">
//       {/* Sidebar - Hidden on smaller screens */}
//       <div className="w-1/4 bg-red-600 shadow-lg p-4 hidden md:block text-white">
//         <img src={LmiLogo} alt="LMI Logo" className="w-24 mx-auto mb-4" />
//         <h2 className="text-xl font-semibold text-center">LMI Chatbot</h2>
//       </div>

//       {/* Chat Section */}
//       <div className="flex flex-col w-full md:w-3/4 p-4 relative">
//         {/* Header with LMI Logo */}
//         <header className="flex items-center justify-between p-4 bg-red-600 text-white rounded-t-lg">
//           <div className="flex items-center space-x-2">
//             <img src={LmiLogo} alt="LMI Logo" className="w-8 h-8" />
//             <h2 className="text-lg font-semibold">LMI Holdings Chatbot</h2>
//           </div>
//           <Menu className="cursor-pointer" />
//         </header>

//         {/* Chat Messages */}
//         <Card className="flex flex-col flex-1 p-4 overflow-auto h-[75vh] bg-gray-100">
//           <CardContent className="space-y-4">
//             {messages.map((msg, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className={`max-w-max p-3 rounded-lg flex items-center space-x-2 shadow-md ${
//                   msg.sender === "user"
//                     ? "bg-red-600 text-white self-end ml-auto"
//                     : "bg-white text-black self-start flex-row"
//                 }`}
//               >
//                 {msg.sender === "bot" && (
//                   <img src={LmiLogo} alt="LMI Logo" className="w-6 h-6" />
//                 )}
//                 <span>{msg.text}</span>
//               </motion.div>
//             ))}
//           </CardContent>
//         </Card>

//         {/* Input Section */}
//         <div className="flex items-center p-4 bg-white rounded-b-lg shadow-md border-t">
//           <Input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyDown}
//             placeholder="Type a message..."
//             className="flex-1 p-2 border rounded-lg"
//           />
//           <Button onClick={sendMessage} className="ml-2 bg-red-600 text-white rounded-lg px-4 py-2">
//             <Send className="w-5 h-5" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { Route, Router } from 'lucide-react'
import ChatPage from './components/ChatPage'
import SignInPage from './components/SignInpage'
import { Routes } from 'react-router-dom'

function App(){
  return(
   <Router>
      <Routes>
        <Route path='/' element={<SignInPage />} />
        <Route path='ChatPage' element={<ChatPage />} />
      </Routes>
   </Router>
  )
}

export default App;
