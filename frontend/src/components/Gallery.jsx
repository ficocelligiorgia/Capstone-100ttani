import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Spinner from "./Spinner";

function Gallery({ onNotify, theme, onAddPostClick }) {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState({});

  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/media", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMediaList(res.data);
      } catch (err) {
        console.error("Errore nel recupero dei media:", err);
        onNotify("Errore nel recupero dei media.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [onNotify, token]);

  const fetchMedia = async () => {
    try {
      const res = await axios.get("http://localhost:5000/media", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMediaList(res.data);
    } catch (error) {
      console.error("Errore:", error.message);
      onNotify("Errore nel recupero dei media", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      await axios.post(`http://localhost:5000/media/${id}/like`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMedia();
    } catch (err) {
      console.error("Errore nel like:", err);
      onNotify("Errore nel like", "error");
    }
  };

  const handleComment = async (id, text) => {
    if (!text) return;
    try {
      await axios.post(
        `http://localhost:5000/media/${id}/comment`,
        { text },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCommentText({ ...commentText, [id]: "" });
      fetchMedia();
      onNotify("Commento aggiunto!", "success");
    } catch (err) {
      console.error("Errore nel commento:", err);
      onNotify("Errore nel commento", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo post?")) return;

    try {
      await axios.delete(`http://localhost:5000/media/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMedia();
      onNotify("Post eliminato con successo!", "success");
    } catch (err) {
      console.error("Errore nella cancellazione:", err);
      onNotify("Errore nella cancellazione", "error");
    }
  };

  const renderMediaCard = (media) => (
    <div
      key={media._id}
      style={{
        backgroundColor: "#fff",
        color: theme.color,
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        padding: "1rem",
        marginBottom: "2rem",
      }}
    >
      {media.fileType === "image" ? (
        <img
          src={`http://localhost:5000${media.fileUrl}`}
          alt={media.title}
          style={{
            width: "100%",
            maxHeight: "500px",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
      ) : (
        <video
          controls
          src={`http://localhost:5000${media.fileUrl}`}
          style={{
            width: "100%",
            maxHeight: "500px",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
      )}

      <h4 style={{ marginTop: "1rem", fontWeight: "600" }}>
        {media.title || "Senza titolo"}
      </h4>

      <div style={{ margin: "0.5rem 0" }}>
        <button
          onClick={() => handleLike(media._id)}
          style={{
            background: "none",
            border: "none",
            fontSize: "1.2rem",
            cursor: "pointer",
            color: theme.color,
          }}
        >
          ❤️
        </button>{" "}
        {media.likes?.length || 0} like
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={commentText[media._id] || ""}
          onChange={(e) =>
            setCommentText({ ...commentText, [media._id]: e.target.value })
          }
          placeholder="Scrivi un commento..."
          style={{
            width: "100%",
            padding: "0.5rem",
            backgroundColor: "#fff",
            color: "#000",
            border: `1px solid #ccc`,
            borderRadius: "6px",
            marginBottom: "0.5rem",
          }}
        />
        <button
          onClick={() => handleComment(media._id, commentText[media._id])}
          style={{
            padding: "0.4rem 1.2rem",
            backgroundColor: "crimson",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Invia
        </button>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <h5 style={{ marginBottom: "0.5rem" }}>Commenti:</h5>
        {media.comments?.length > 0 ? (
          media.comments.map((c, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: "0.75rem",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "#888",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "0.75rem",
                  fontWeight: "bold",
                }}
              >
                {c.user?.username?.charAt(0).toUpperCase() || "?"}
              </div>
              <div>
                <strong>{c.user?.username || "Anonimo"}:</strong> {c.text}
                <div style={{ fontSize: "0.75rem", color: "#aaa" }}>
                  {new Date(c.createdAt).toLocaleString("it-IT", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "#555", margin: 0 }}>Nessun commento ancora.</p>
        )}
      </div>

      {user && media.userId && user.id === media.userId._id && (
        <button
          onClick={() => handleDelete(media._id)}
          style={{
            backgroundColor: "crimson",
            color: "white",
            border: "none",
            padding: "0.4rem 0.8rem",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Elimina
        </button>
      )}

      {user && user.role === "admin" && (
        <button
          onClick={() => handleDelete(media._id)}
          style={{
            backgroundColor: "darkred",
            color: "white",
            border: "none",
            padding: "0.4rem 0.8rem",
            borderRadius: "6px",
            cursor: "pointer",
            marginLeft: "0.5rem",
          }}
        >
          Elimina (Admin)
        </button>
      )}
    </div>
  );

  return (
    <div style={{ padding: "2rem", color: theme.color, position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div></div>
        <button
          onClick={onAddPostClick}
          title="Crea nuovo post"
          style={{
            backgroundColor: "crimson",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "45px",
            height: "45px",
            fontSize: "1.2rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
          }}
        >
          <FaPlus />
        </button>
      </div>

      {loading ? (
        <Spinner theme={theme} />
      ) : mediaList.length === 0 ? (
        <p>Nessun media disponibile.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "2rem",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          {mediaList.map(renderMediaCard)}
        </div>
      )}
    </div>
  );
}

export default Gallery;
