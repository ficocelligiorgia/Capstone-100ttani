import React, { useEffect, useState } from "react";
import axios from "axios";
import Map from "./Map";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Events({ theme, token, userRole }) {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const isAdmin = userRole === "admin" || userRole === "staff";

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    axios
      .get("http://localhost:5000/events")
      .then((res) => {
        console.log("Eventi ricevuti:", res.data);
        setEvents(res.data);
      })
      .catch((err) => console.error("Errore nel recupero eventi", err));
  };

  const handleVote = async (eventId, optionIndex) => {
    try {
      await axios.post(`http://localhost:5000/events/${eventId}/vote`, { optionIndex });
      fetchEvents(); 
    } catch (err) {
      console.error("Errore nel votare:", err);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo evento?")) return;
    try {
      await axios.delete(`http://localhost:5000/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEvents(); 
    } catch (err) {
      console.error("Errore nell'eliminazione evento:", err);
    }
  };

  return (
    <div style={{ padding: "2rem", color: theme.color, position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {isAdmin && (
          <button
            onClick={() => navigate("/crea-evento")}
            title="Crea nuovo evento"
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
        )}
      </div>

      {events.length === 0 ? (
        <p>Nessun evento disponibile.</p>
      ) : (
        events.map((event, index) => (
          <div
            key={index}
            style={{
              marginTop: "2rem",
              padding: "1rem",
              background: theme.cardBackground,
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              position: "relative",
            }}
          >
            {isAdmin && (
              <button
                onClick={() => handleDelete(event._id)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "transparent",
                  border: "none",
                  color: "crimson",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                }}
                title="Elimina evento"
              >
                <FaTrash />
              </button>
            )}

            <h2> {event.title || "Senza titolo"}</h2>

            <p>
               {event.date ? new Date(event.date).toLocaleDateString("it-IT", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }) : "Data non specificata"}
            </p>

            <p>
              <i>{event.location || "Nessuna posizione"}</i>
            </p>

            {event.description && <p>{event.description}</p>}

            {event.image && (
              <img
                src={`http://localhost:5000${event.image}`}
                alt="Evento"
                style={{ maxWidth: "100%", borderRadius: "6px", marginTop: "1rem" }}
              />
            )}

            {event.coordinates?.lat && event.coordinates?.lng && (
              <div style={{ marginTop: "1rem" }}>
                <Map locations={[event]} />
              </div>
            )}

            {event.poll?.question ? (
              <div style={{ marginTop: "1rem" }}>
                <h4> {event.poll.question}</h4>
                <ul style={{ paddingLeft: "1rem" }}>
                  {event.poll.options.map((opt, i) => (
                    <li key={i} style={{ marginBottom: "0.5rem" }}>
                      {opt.text} — <strong>{opt.votes} voti</strong>
                      <button
                        onClick={() => handleVote(event._id, i)}
                        style={{
                          marginLeft: "10px",
                          padding: "0.2rem 0.6rem",
                          backgroundColor: "crimson",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                        }}
                      >
                        VOTA
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p> <i>Nessun sondaggio disponibile</i></p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Events;
