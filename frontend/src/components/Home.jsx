import React, { useState } from "react";
import logoLight from "../assets/logo4.png"; 
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";

function Home({ theme, isLoggedIn, onNavigate, onShowLogin }) {
  const [isMuted, setIsMuted] = useState(false);

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
        Il tuo browser non supporta i video HTML5.
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
          zIndex: 2,
        }}
        title={isMuted ? "Riattiva audio" : "Disattiva audio"}
      >
        {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
      </button>

      
      <div
        style={{
          zIndex: 1,
          color: "#fff",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "100%",
          textAlign: "center",
          padding: "0 2rem",
        }}
      >
        <img
          src={logoLight}
          alt="Logo 100ttani"
          style={{ width: "200px", marginBottom: "1rem" }}
        />
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
          Benvenuto su <span style={{ color: "red" }}>100ttani</span> Motoclub
        </h1>
        <p style={{ fontSize: "1.2rem", maxWidth: "600px", marginBottom: "2rem" }}>
          Vivi la passione per le due ruote. Scopri eventi, condividi i tuoi scatti
          e incontra altri motociclisti come te.
        </p>

        {!isLoggedIn && (
          <button
            onClick={onShowLogin}
            style={{
              backgroundColor: "crimson",
              color: "#fff",
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            Accedi o Registrati
          </button>
        )}
      </div>
    </div>
  );
}

export default Home;
