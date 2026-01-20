import { React, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppStore } from "./store";

// Import pages
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";

import { api } from "./lib/api";
import { GET_USER_INFO } from "./utils.js/constant";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

export default function App() {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await api.get(GET_USER_INFO, {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.user?._id) {
          setUserInfo(response.data.user);
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        console.log(error)
        setUserInfo(undefined);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) getUserInfo();
    else setLoading(false);
  }, [userInfo, setUserInfo]);

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <AuthRoute>
            <Auth />
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
      <Route path="*" element={<Auth />} />
    </Routes>
  );
}
