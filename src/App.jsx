import { Route, Routes } from 'react-router-dom';
import ChatPage from './components/ChatPage';
import SignInPage from './components/SignInpage';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

function App() {
  return (
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/auth" element={<SignInPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:chatId" element={<ChatPage />} />
      </Routes>
  );
}

export default App;
