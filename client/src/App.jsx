import { Routes, Route } from "react-router-dom";

// Import pages
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/profile" element={<Profile />} />

      <Route path="*" element={<Auth />} />
    </Routes>
  );
}
