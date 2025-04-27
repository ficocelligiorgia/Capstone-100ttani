import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreaEvento({ theme, token, onNotify }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    lat: "",
    lng: "",
    pollQuestion: "",
    options: ["", ""],
    image: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    const updated = [...form.options];
    updated[index] = value;
    setForm({ ...form, options: updated });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const addOption = () => {
    setForm({ ...form, options: [...form.options, ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("date", form.date);
    formData.append("location", form.location);
    formData.append("coordinates[lat]", form.lat);
    formData.append("coordinates[lng]", form.lng);
    formData.append("poll[question]", form.pollQuestion);

    form.options.forEach((opt, i) =>
      formData.append(`poll[options][${i}][text]`, opt)
    
    );

    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      await axios.post("http://localhost:5000/Events", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      onNotify(" Evento creato con successo", "success");
      navigate("/Events");
    } catch (err) {
      console.error("Errore nella creazione evento:", err);
      onNotify(" Errore nella creazione evento", "error");
    }
  };

  return (
    <div style={{ padding: "2rem", color: theme.color }}>
      <h2>Crea un nuovo Evento</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "600px" }}>
        <input name="title" placeholder="Titolo" value={form.title} onChange={handleChange} style={inputStyle(theme)} />
        <textarea name="description" placeholder="Descrizione" value={form.description} onChange={handleChange} style={inputStyle(theme)} />
        <input type="date" name="date" value={form.date} onChange={handleChange} style={inputStyle(theme)} />
        <input name="location" placeholder="Luogo" value={form.location} onChange={handleChange} style={inputStyle(theme)} />
        <input name="lat" placeholder="Latitudine" value={form.lat} onChange={handleChange} style={inputStyle(theme)} />
        <input name="lng" placeholder="Longitudine" value={form.lng} onChange={handleChange} style={inputStyle(theme)} />

        <h4>Sondaggio</h4>
        <input name="pollQuestion" placeholder="Domanda sondaggio" value={form.pollQuestion} onChange={handleChange} style={inputStyle(theme)} />
        {form.options.map((opt, i) => (
          <input
            key={i}
            placeholder={`Opzione ${i + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(i, e.target.value)}
            style={inputStyle(theme)}
          />
        ))}
        <button type="button" onClick={addOption} style={buttonStyle}>➕ Aggiungi opzione</button>

        <input type="file" onChange={handleFileChange} accept="image/*" style={{ marginTop: "1rem" }} />
        <button type="submit" style={buttonStyle}> Crea Evento</button>
      </form>
    </div>
  );
}

const inputStyle = (theme) => ({
  width: "100%",
  padding: "0.5rem",
  margin: "0.5rem 0",
  border: `1px solid ${theme.borderColor}`,
  borderRadius: "6px",
  background: theme.inputBackground,
  color: theme.color,
});

const buttonStyle = {
  padding: "0.5rem 1rem",
  backgroundColor: "crimson",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  marginTop: "1rem",
};

export default CreaEvento;
