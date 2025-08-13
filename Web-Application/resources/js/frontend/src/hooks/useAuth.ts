import { useState, useEffect } from "react";
import axios from "../api";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  bio: string | null;
  role: 'user' | 'admin'; // ✅ Add this line
}


const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // 🔁 Load user from localStorage on init
 useEffect(() => {
  const verifyUser = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const res = await axios.get("/user");
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        console.error("Token invalid or expired", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
      }
    }
    setLoading(false);
  };

  verifyUser();
}, []);


  // ✅ Login function
  const login = async (email: string, password: string) => {
    try {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];

      const response = await axios.post("/login", { email, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login Failed", error);
      setError("Invalid email or password");
      throw error;
    }
  };

  // ✅ Signup function
  const signup = async (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      const { user, token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      navigate("/dashboard");
    } catch (error: any) {
      setError(error.response?.data?.message || "Signup failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout function
  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (token) {
        await axios.post("/logout", {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    } catch (error: any) {
      console.error("Logout failed:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Refresh user from API
  const refreshUser = async () => {
    try {
      const res = await axios.get("/user");
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (e) {
      console.error("Failed to refresh user", e);
    }
  };

  return { user, loading, error, login, signup, logout, refreshUser };
};

export default useAuth;
