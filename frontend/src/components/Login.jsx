import React, { useState } from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";

function Login({ onLoginSuccess, onSwitchToRegister, isMuted, setIsMuted }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);

        
        const payload = JSON.parse(atob(data.token.split(".")[1]));
        console.log("Token decodificato:", payload);

        onLoginSuccess(data.token); 
      } else {
        setMessage(data.message || "Credenziali non valide.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Errore di connessione.");
    }
  };

  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      
      <video
        autoPlay
        loop
        muted={isMuted}
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source src="/videos/landing.mp4" type="video/mp4" />
      </video>

      
      <button
        onClick={() => setIsMuted(!isMuted)}
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          background: "rgba(0,0,0,0.5)",
          border: "none",
          color: "white",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          fontSize: "1.2rem",
          cursor: "pointer",
          zIndex: 1,
        }}
        title={isMuted ? "Riattiva audio" : "Disattiva audio"}
      >
        {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
      </button>

      
      <div style={formContainer}>
        <h2>Accedi</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <div style={buttonGroup}>
            <button type="submit" style={buttonStyle}>
              Accedi
            </button>
            <button
              type="button"
              onClick={onSwitchToRegister}
              style={{ ...buttonStyle, backgroundColor: "#888" }}
            >
              Registrati
            </button>
          </div>
        </form>
        {message && <p style={messageStyle}>{message}</p>}
      </div>
    </div>
  );
}

const formContainer = {
  zIndex: 1,
  maxWidth: "400px",
  margin: "0 auto",
  padding: "3rem",
  textAlign: "center",
  color: "#fff",
  position: "relative",
  top: "50%",
  transform: "translateY(-50%)",
};

const inputStyle = {
  marginBottom: "1rem",
  padding: "0.5rem",
  width: "100%",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: "0.6rem 1.5rem",
  backgroundColor: "crimson",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "1rem",
};

const buttonGroup = {
  display: "flex",
  justifyContent: "center",
  gap: "1rem",
  marginTop: "1rem",
};

const messageStyle = {
  marginTop: "1rem",
  fontWeight: "bold",
  color: "#ffaaaa",
};

export default Login;
