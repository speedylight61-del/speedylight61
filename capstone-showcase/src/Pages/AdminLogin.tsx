import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/AdminLogin.css";
import asuLogoPlain from "../assets/asuLogoPlain.png";
import { EyeOff, Eye } from "lucide-react";
import { useAuth } from "../AuthContext";

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { setIsSignedIn, isSignedIn , setToken, isTokenValid} = useAuth();
  const[error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isSignedIn && isTokenValid())
  {
    navigate("/admin-dashboard");
  }
  }, [isSignedIn, isTokenValid, navigate]);
  
  const API_BASE_URL = import.meta.env.PROD ? 
  'api' : 'http://localhost:3000/api';

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetch(
      `${API_BASE_URL}/signin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      }
    ).then((res) => res.json())
    .then((data) => {
      if (data && data.jwtToken) {
        setToken(data.jwtToken);
        setIsSignedIn(true);
        navigate("/admin-dashboard");
      } else {
        setError("Invalid username or password.");
        setIsSignedIn(false);
        setToken(null);
        console.error("Invalid response data:", data);
      }
    })
    .catch((error) => {
      console.log(error);
      setError("Invalid username or password.");
      console.error("Error fetching data:", error);
    });
  };

  return (
    <div className="container-login-admin">
      <div className="box">
        <img src={asuLogoPlain} alt="ASU Logo" className="logo" />
        <h1 style={{ color: "black" }}>ASU Capstone Showcase</h1>
        <h2 className="admin-login-title">Admin Login</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <span className="input">
            <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="admin-input"
          />
          </span>

          <span className="input">
            <input
              type={showPassword ? "text" : "password"}
              
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="admin-input"
            />
            {showPassword ? (
              <Eye onClick={() => setShowPassword(false)} className="eye-icon" />
            ) : (
              <EyeOff onClick={() => setShowPassword(true)} className="eye-icon" />
            )}
          </span>
          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
