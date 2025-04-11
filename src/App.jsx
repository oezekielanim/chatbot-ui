import { Route, Routes } from 'react-router-dom';
import ChatPage from './components/ChatPage';
import SignInPage from './components/SignInpage';

function App() {
  return (
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:chatId" element={<ChatPage />} />
      </Routes>
  );
}

export default App;
