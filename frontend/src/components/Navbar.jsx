import React from "react";

function Navbar({
  isLoggedIn,
  onLogout,
  onToggleAuth,
  isDark,
  onToggleTheme,
  onNavigate,
}) {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#222",
        padding: "1rem 2rem",
        color: "#fff",
        fontFamily: "sans-serif",
      }}
    >
      
      <a
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          color: "#fff",
        }}
      >
        <img
          src="/logo.png"
          alt="Logo"
          style={{ height: "45px", marginRight: "0.75rem" }}
        />
      </a>

      
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        {isLoggedIn && (
          <>
            <NavLink label=" Home" onClick={() => onNavigate("/")} />
            <NavLink label=" Galleria" onClick={() => onNavigate("/gallery")} />
            <NavLink label=" Profilo" onClick={() => onNavigate("/profile")} />
            <NavLink label=" Eventi" onClick={() => onNavigate("/events")} />
            <NavLink label=" Shop" onClick={() => onNavigate("/shop")} />
            <NavLink label=" Info" onClick={() => onNavigate("/info")} />
          </>
        )}

        
        <button
          onClick={onToggleTheme}
          title="Cambia tema"
          style={{
            background: "transparent",
            border: "none",
            fontSize: "1.2rem",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {isDark ? "☀️" : "🌙"}
        </button>

        
        {isLoggedIn ? (
          <NavLink
            label=" Logout"
            onClick={onLogout}
            styleOverride={{ color: "crimson" }}
          />
        ) : (
          <NavLink label=" Login / Register" onClick={onToggleAuth} />
        )}
      </div>
    </nav>
  );
}

function NavLink({ label, onClick, styleOverride = {} }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        border: "none",
        color: "#ccc",
        fontSize: "0.95rem",
        cursor: "pointer",
        padding: "0.3rem 0.6rem",
        borderRadius: "4px",
        transition: "color 0.2s, background 0.2s",
        ...styleOverride,
      }}
      onMouseOver={(e) => (e.target.style.color = "#fff")}
      onMouseOut={(e) =>
        (e.target.style.color = styleOverride.color || "#ccc")
      }
    >
      {label}
    </button>
  );
}

export default Navbar;

