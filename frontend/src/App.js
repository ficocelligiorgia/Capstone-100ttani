import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import UploadMedia from "./components/UploadMedia";
import Gallery from "./components/Gallery";
import Notification from "./components/Notification";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Shop from "./components/Shop";
import ProductDetail from "./components/ProductDetail";
import Profile from "./components/Profile";
import Success from "./components/Success";
import Cancel from "./components/Cancel";
import { CartProvider } from "./components/CartContext";
import Events from "./components/Events";
import "leaflet/dist/leaflet.css";
import CreaEvento from "./components/CreaEvento";
import Info from "./components/Info";

const lightTheme = {
  background: "#ffffff",
  color: "#222",
  inputBackground: "#fff",
  inputText: "#000",
  borderColor: "#ccc",
  cardBackground: "#fdfdfd",
  buttonBackground: "#c10000",
  buttonColor: "#fff",
};

const darkTheme = {
  background: "#121212",
  color: "#f5f5f5",
  inputBackground: "#1e1e1e",
  inputText: "#fff",
  borderColor: "#444",
  cardBackground: "#1a1a1a",
  buttonBackground: "#c10000",
  buttonColor: "#fff",
};

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userRole, setUserRole] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [isDark, setIsDark] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const navigate = useNavigate();
  const themeStyles = isDark ? darkTheme : lightTheme;

  const extractUserRole = (jwtToken) => {
    try {
      const payload = JSON.parse(atob(jwtToken.split(".")[1]));
      return payload.role || "";
    } catch (err) {
      console.error(" Errore nella decodifica del token", err);
      return "";
    }
  };

  const handleLoginSuccess = (receivedToken) => {
    localStorage.setItem("token", receivedToken);
    setToken(receivedToken);
    setUserRole(extractUserRole(receivedToken));
    showNotification(" Login effettuato!", "success");
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserRole("");
    showNotification(" Logout effettuato", "info");
    navigate("/");
  };

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  const toggleTheme = () => setIsDark((prev) => !prev);

  useEffect(() => {
    document.body.style.backgroundColor = themeStyles.background;
    document.body.style.color = themeStyles.color;

    if (token) {
      const role = extractUserRole(token);
      if (role !== userRole) setUserRole(role);
    }
  }, [themeStyles, token, userRole]);

  return (
    <CartProvider>
      <Navbar
        isLoggedIn={!!token}
        onLogout={handleLogout}
        onToggleAuth={() => {
          setShowLogin(true);
          navigate("/auth");
        }}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onNavigate={navigate}
      />

      <Notification message={notification.message} type={notification.type} />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              theme={themeStyles}
              isDark={isDark}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
              isLoggedIn={!!token}
              onNavigate={navigate}
              onShowLogin={() => {
                setShowLogin(true);
                navigate("/auth");
              }}
            />
          }
        />

        <Route
          path="/auth"
          element={
            !token ? (
              showLogin ? (
                <Login
                  isMuted={isMuted}
                  setIsMuted={setIsMuted}
                  onLoginSuccess={handleLoginSuccess}
                  onSwitchToRegister={() => setShowLogin(false)}
                />
              ) : (
                <Register
                  isMuted={isMuted}
                  setIsMuted={setIsMuted}
                  onRegisterSuccess={handleLoginSuccess}
                  onSwitchToLogin={() => setShowLogin(true)}
                />
              )
            ) : null
          }
        />

        <Route
          path="/upload"
          element={
            token && (
              <UploadMedia
                onNotify={showNotification}
                theme={themeStyles}
                onUploadSuccess={() => navigate("/gallery")}
              />
            )
          }
        />

        <Route
          path="/gallery"
          element={
            token && (
              <Gallery
                onNotify={showNotification}
                theme={themeStyles}
                onAddPostClick={() => navigate("/upload")}
              />
            )
          }
        />

        <Route
          path="/shop"
          element={
            <Shop
              theme={themeStyles}
              token={token}
              userRole={userRole}
              onNotify={showNotification}
            />
          }
        />

        <Route path="/shop/:id" element={<ProductDetail theme={themeStyles} />} />

        <Route
          path="/profile"
          element={
            token ? (
              <Profile onNotify={showNotification} theme={themeStyles} />
            ) : (
              <Login
                onLoginSuccess={handleLoginSuccess}
                isMuted={isMuted}
                setIsMuted={setIsMuted}
                onSwitchToRegister={() => setShowLogin(false)}
              />
            )
          }
        />

        <Route path="/success" element={<Success theme={themeStyles} />} />
        <Route path="/cancel" element={<Cancel theme={themeStyles} />} />

        <Route
          path="/events"
          element={<Events theme={themeStyles} token={token} userRole={userRole} />}
        />

        <Route
          path="/crea-evento"
          element={
            token ? (
              <CreaEvento token={token} theme={themeStyles} onNotify={showNotification} />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        <Route
          path="/info"
          element={<Info />}
        />
      </Routes>
    </CartProvider>
  );
}

export default App;

