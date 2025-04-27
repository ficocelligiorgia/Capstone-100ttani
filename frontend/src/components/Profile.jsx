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
      setEvent(res.data[res.data.length - 1] || null);
    } catch (err) {
      console.error("Errore caricamento evento", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
      fetchLatestEvent();
      axios
        .get("http://localhost:5000/media?mine=true", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setMedia(res.data))
        .catch((err) => onNotify("Errore nel recupero media", "error"));
    }
  }, [token]);

  const handleLike = async (id) => {
    try {
      await axios.post(`http://localhost:5000/media/${id}/like`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refreshMedia();
    } catch (err) {
      onNotify("Errore nel like", "error");
    }
  };

  const handleComment = async (id) => {
    if (!commentText[id]) return;
    try {
      await axios.post(
        `http://localhost:5000/media/${id}/comment`,
        { text: commentText[id] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentText({ ...commentText, [id]: "" });
      refreshMedia();
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
      const updatedMedia = media.filter((item) => item._id !== id);
      setMedia(updatedMedia);
    } catch (err) {
      onNotify("Errore nella cancellazione", "error");
    }
  };

  const refreshMedia = async () => {
    try {
      const res = await axios.get("http://localhost:5000/media?mine=true", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedia(res.data);
    } catch (err) {
      onNotify("Errore aggiornamento media", "error");
    }
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
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

  return (
    <div style={{ display: "flex", backgroundColor: theme.background, color: theme.color }}>
      <div style={{ flex: 1, padding: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}>
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
            <h2>{user.username || "Nome Utente"}</h2>
            <p>{user.bio || "Nessuna biografia disponibile."}</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "2rem" }}>
          <div style={{ flex: 1 }}>
            {media.map((m) => (
              <div
                key={m._id}
                style={{
                  background: theme.cardBackground,
                  color: theme.color,
                  padding: "1rem",
                  marginBottom: "2rem",
                  borderRadius: "10px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  maxWidth: "500px",
                }}
              >
                {m.fileType === "image" ? (
                  <img src={`http://localhost:5000${m.fileUrl}`} alt={m.title} style={imageStyle} />
                ) : (
                  <video controls src={`http://localhost:5000${m.fileUrl}`} style={imageStyle} />
                )}
                <h4>{m.title}</h4>
                <button onClick={() => handleLike(m._id)} style={{ background: "none", border: "none", color: theme.color }}>
                  ❤️ {m.likes?.length || 0} like
                </button>
                <div>
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

          {event && (
            <div style={{ flex: 1, background: theme.cardBackground, padding: "1rem", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
              <h3>📍 {event.title}</h3>
              <p>{event.description}</p>
            </div>
          )}
        </div>
      </div>

      <div style={{ width: "250px", minHeight: "100vh", background: theme.cardBackground, color: theme.color, padding: "1rem", boxShadow: "-2px 0 5px rgba(0,0,0,0.1)" }}>
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

        <div style={{ marginTop: "2rem" }}>
          <a href="https://chat.whatsapp.com/EtEtsQ9G6G75kI0L7fr8k4?utm_campaign=linkinbio&utm_medium=referral&utm_source=later-linkinbio" target="_blank" rel="noopener noreferrer" style={{ display: "block", marginBottom: "1rem", color: "crimson" }}>Gruppo WhatsApp</a>
          <a href="https://www.instagram.com/100ttani_motoclub?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" style={{ display: "block", color: "crimson" }}>Pagina Instagram</a>
        </div>
      </div>

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        theme={theme}
        isAuthenticated={!!token}
      />
    </div>
  );
}

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

const sendBtnStyle = {
  marginTop: "0.5rem",
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

export default Profile;
