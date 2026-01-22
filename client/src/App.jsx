import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AuthPage from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import Navbar from "./components/common/Navbar";
import { useAppStore } from "./store";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  return userInfo?._id ? children : <Navigate to="/auth" replace />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  return userInfo?._id ? <Navigate to="/chat" replace /> : children;
};

export default function App() {
  const { initializeAuth, loading, userInfo } = useAppStore();
  const location = useLocation();

  useEffect(() => {
    initializeAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const showNavbar = userInfo?._id && location.pathname !== "/auth";

  return (
    <>
      {showNavbar && <Navbar />}

      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <AuthPage />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </>
  );
}
