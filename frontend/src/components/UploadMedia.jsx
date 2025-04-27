import React, { useState } from "react";

function UploadMedia({ onNotify, theme, onUploadSuccess }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);

    if (selected) {
      const url = URL.createObjectURL(selected);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Devi selezionare un file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/media", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Media caricato con successo!");
        setTitle("");
        setFile(null);
        setPreviewUrl(null);
        onNotify && onNotify(" Media caricato con successo!", "success");

        
        if (onUploadSuccess) {
          onUploadSuccess();
        }

      } else {
        setMessage(` Errore: ${data.message}`);
        onNotify && onNotify(` Errore: ${data.message}`, "error");
      }
    } catch (err) {
      console.error("Errore durante l'upload:", err);
      setMessage(" Errore durante il caricamento.");
      onNotify && onNotify(" Errore durante il caricamento.", "error");
    }
  };

  const handleCancel = () => {
    setTitle("");
    setFile(null);
    setPreviewUrl(null);
    setMessage(" Upload annullato.");
  };

  return (
    <div style={{ padding: "2rem", color: theme.color, backgroundColor: theme.background }}>
      <h2> Carica un Media</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Titolo: </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              marginLeft: "1rem",
              padding: "0.5rem",
              width: "300px",
              background: theme.inputBackground,
              color: theme.inputText,
              border: `1px solid ${theme.borderColor}`,
              borderRadius: "5px",
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>File: </label>
          <input
            type="file"
            onChange={handleFileChange}
            style={{
              marginLeft: "1rem",
              background: theme.inputBackground,
              color: theme.inputText,
              border: `1px solid ${theme.borderColor}`,
              borderRadius: "5px",
              padding: "0.3rem",
            }}
            required
          />
        </div>

        {previewUrl && (
          <div style={{ marginBottom: "1rem" }}>
            <h4>Anteprima:</h4>
            {file?.type.startsWith("image") ? (
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: "100%",
                  maxWidth: "600px",
                  maxHeight: "500px",
                  borderRadius: "10px",
                  marginBottom: "1rem",
                  boxShadow: "0 0 12px rgba(0,0,0,0.2)",
                }}
              />
            ) : (
              <video
                controls
                src={previewUrl}
                style={{
                  width: "100%",
                  maxWidth: "600px",
                  maxHeight: "500px",
                  borderRadius: "10px",
                  marginBottom: "1rem",
                  boxShadow: "0 0 12px rgba(0,0,0,0.2)",
                }}
              />
            )}
          </div>
        )}

        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            type="submit"
            style={{
              padding: "0.5rem 1.5rem",
              backgroundColor: theme.buttonBackground,
              color: theme.buttonColor,
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Carica
          </button>

          {previewUrl && (
            <button
              type="button"
              onClick={handleCancel}
              style={{
                padding: "0.5rem 1.5rem",
                backgroundColor: "#888",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Annulla
            </button>
          )}
        </div>
      </form>

      {message && (
        <p
          style={{
            marginTop: "1rem",
            color: message.includes("✅") ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default UploadMedia;

