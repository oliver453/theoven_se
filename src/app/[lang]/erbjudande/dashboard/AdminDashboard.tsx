"use client";

import React, { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import DashboardContent from "./components/DashboardContent";

export default function AdminDashboard({ dict, lang }: any) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authToken, setAuthToken] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('adminAuthToken');
    if (token) {
      verifyToken(token);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('/api/offer/list', {
        headers: { 
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        setAuthToken(token);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('adminAuthToken');
        setAuthToken("");
        setIsAuthenticated(false);
      }
    } catch {
      localStorage.removeItem('adminAuthToken');
      setAuthToken("");
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (password: string) => {
    try {
      const response = await fetch('/api/offer/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        localStorage.setItem('adminAuthToken', token);
        setAuthToken(token);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: dict.offer.dashboard.wrongPassword };
      }
    } catch {
      return { success: false, error: dict.offer.dashboard.error };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthToken');
    setIsAuthenticated(false);
    setAuthToken("");
  };

  if (isAuthenticated === null) {
    return null;
  }

  if (!isAuthenticated) {
    return <LoginForm dict={dict} onLogin={handleLogin} />;
  }

  return (
    <DashboardContent 
      dict={dict} 
      lang={lang}
      authToken={authToken}
      onLogout={handleLogout}
    />
  );
}