import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { CartContext } from "./CartContext";
import CartDrawer from "./CartDrawer";

function Profile({ onNotify, theme }) {
  const [user, setUser] = useState({});
  const [media, setMedia] = useState([]);
  const [event, setEvent] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [commentText, setCommentText] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const token = localStorage.getItem("token");

  const { cartItems, addToCart, removeFromCart, updateQuantity } = useContext(CartContext);

  useEffect(() => {
    if (!token) return;
    fetchUser();
    fetchLatestEvent();
    fetchMedia();
    const interval = setInterval(() => {
      fetchLatestEvent();
    }, 10000);
    return () => clearInterval(interval);
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      onNotify("Errore nel recupero profilo", "error");
    }
  };

  const fetchLatestEvent = async () => {
    try {
      const res = await axios.get("http://localhost:5000/events");
      const validEvents = res.data.filter(e => e.title && e.date && new Date(e.date) > new Date("2000-01-01"));
      const sorted = validEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
      setEvent(sorted[0] || null);
    } catch (err) {
      console.error("Errore caricamento evento", err);
    }
  };

  const fetchMedia = async () => {
    try {
      const res = await axios.get("http://localhost:5000/media?mine=true", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedia(res.data);
    } catch (err) {
      onNotify("Errore aggiornamento media", "error");
    }
  };

  const handleLike = async (id) => {
    try {
      await axios.post(`http://localhost:5000/media/${id}/like`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMedia();
    } catch (err) {
      onNotify("Errore nel like", "error");
    }
  };

  const handleComment = async (id) => {
    if (!commentText[id]) return;
    try {
      await axios.post(`http://localhost:5000/media/${id}/comment`, {
        text: commentText[id],
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCommentText({ ...commentText, [id]: "" });
      fetchMedia();
    } catch (err) {
      onNotify("Errore nel commento", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo post?")) return;
    try {
      await axios.delete(`http://localhost:5000/media/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedia(media.filter((item) => item._id !== id));
    } catch (err) {
      onNotify("Errore nella cancellazione", "error");
    }
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveUser = async () => {
    try {
      const formData = new FormData();
      formData.append("username", user.username || "");
      formData.append("email", user.email || "");
      formData.append("phone", user.phone || "");
      formData.append("address", user.address || "");
      formData.append("bio", user.bio || "");
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await axios.post("http://localhost:5000/profile/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(res.data.user);
      setAvatarPreview(null);
      setAvatarFile(null);
      onNotify("Profilo aggiornato con successo", "success");
    } catch (err) {
      onNotify("Errore nel salvataggio del profilo", "error");
    }
  };

  const avatarStyle = {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
  };

  const imageStyle = {
    width: "100%",
    maxHeight: "500px",
    objectFit: "cover",
    borderRadius: "8px",
  };

  const inputStyle = (theme) => ({
    width: "100%",
    marginBottom: "0.5rem",
    background: theme.inputBackground,
    color: theme.color,
    border: `1px solid ${theme.borderColor}`,
    borderRadius: "6px",
    padding: "0.4rem",
  });

  const mediaCardStyle = (theme) => ({
    background: theme.cardBackground,
    color: theme.color,
    padding: "1rem",
    marginBottom: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    maxWidth: "600px",
    marginInline: "auto",
  });

  const buttonBase = (theme) => ({
    background: "none",
    border: "none",
    color: theme.color,
    cursor: "pointer",
  });

  const sendBtnStyle = {
    padding: "0.3rem 0.6rem",
    backgroundColor: "crimson",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  };

  const deleteBtnStyle = {
    marginTop: "1rem",
    backgroundColor: "crimson",
    color: "white",
    border: "none",
    padding: "0.4rem 0.8rem",
    borderRadius: "6px",
    cursor: "pointer",
  };

  const saveBtnStyle = {
    width: "100%",
    padding: "0.5rem",
    backgroundColor: "crimson",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  };

  const sideBtnStyle = {
    width: "100%",
    padding: "0.5rem",
    backgroundColor: "#ddd",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginBottom: "1rem",
  };

  return (
    <div style={{ display: "flex", backgroundColor: theme.background, color: theme.color }}>
      
      <div style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        <h2 style={{ marginBottom: "1rem" }}>     </h2>
        {media.map((m) => (
          <div key={m._id} style={mediaCardStyle(theme)}>
            {m.fileType === "image" ? (
              <img src={`http://localhost:5000${m.fileUrl}`} alt={m.title} style={imageStyle} />
            ) : (
              <video controls src={`http://localhost:5000${m.fileUrl}`} style={imageStyle} />
            )}
            <h4 style={{ marginTop: "0.5rem" }}>{m.title}</h4>
            <button onClick={() => handleLike(m._id)} style={{ ...buttonBase(theme), marginTop: "0.5rem" }}>
              ❤️ {m.likes?.length || 0} like
            </button>
            <div style={{ marginTop: "1rem" }}>
              <input
                type="text"
                placeholder="Scrivi un commento..."
                value={commentText[m._id] || ""}
                onChange={(e) => setCommentText({ ...commentText, [m._id]: e.target.value })}
                style={inputStyle(theme)}
              />
              <button onClick={() => handleComment(m._id)} style={sendBtnStyle}>Invia</button>
            </div>
            <div style={{ marginTop: "1rem" }}>
              <strong>Commenti:</strong>
              {m.comments?.length ? (
                m.comments.map((c, i) => (
                  <p key={i}><strong>{c.user?.username || "Anonimo"}:</strong> {c.text}</p>
                ))
              ) : (
                <p>Nessun commento ancora.</p>
              )}
            </div>
            <button onClick={() => handleDelete(m._id)} style={deleteBtnStyle}>Elimina</button>
          </div>
        ))}
      </div>

      
      <div style={{
        flex: 1,
        padding: "2rem",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        marginTop: "4.6rem"  
      }}>
        {event ? (
          <div style={{
            background: theme.cardBackground,
            padding: "1.5rem",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            maxWidth: "500px",
          }}>
            <h3> {event.title}</h3>
            <p>{event.description}</p>
            <p><i>{event.location || "Posizione non specificata"}</i></p>
          </div>
        ) : (
          <div><p><i>Nessun evento disponibile al momento.</i></p></div>
        )}
      </div>

   
      <div style={{ width: "280px", minHeight: "100vh", background: theme.cardBackground, color: theme.color, padding: "1.5rem", boxShadow: "-2px 0 5px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "1.5rem" }}>
          <label style={{ cursor: "pointer" }}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="Preview" style={avatarStyle} />
            ) : user.avatar ? (
              <img src={`http://localhost:5000${user.avatar}`} alt="Avatar" style={avatarStyle} />
            ) : (
              <FaUserCircle size={100} color={theme.borderColor || "#ccc"} />
            )}
            <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
          </label>
          <div style={{ marginLeft: "1rem" }}>
            <h2 style={{ fontSize: "1.2rem" }}>{user.username || "Nome Utente"}</h2>
            <p style={{ fontSize: "0.9rem" }}>{user.bio || "Nessuna biografia disponibile."}</p>
          </div>
        </div>

        <button onClick={() => setShowInfo(!showInfo)} style={sideBtnStyle}>Informazioni personali ▼</button>
        {showInfo && (
          <div>
            {["username", "email", "phone", "address"].map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                placeholder={field}
                value={user[field] || ""}
                onChange={handleUserChange}
                style={inputStyle(theme)}
              />
            ))}
            <textarea
              name="bio"
              placeholder="Bio"
              value={user.bio || ""}
              onChange={handleUserChange}
              style={inputStyle(theme)}
            />
            <button onClick={handleSaveUser} style={saveBtnStyle}>Salva</button>
          </div>
        )}

        <button onClick={() => setCartOpen(true)} style={{ ...sideBtnStyle, marginTop: "1rem" }}>🛒 Apri Carrello</button>

        <CartDrawer
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          theme={theme}
          isAuthenticated={!!token}
        />
      </div>
    </div>
  );
}

export default Profile;
