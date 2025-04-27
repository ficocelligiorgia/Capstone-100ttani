import React, { useState } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

function ProductDetail({ product, onClose, onAddToCart, theme }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const baseUrl = "http://localhost:5000";

  const images = product.images?.length
    ? product.images
    : ["/images/placeholder.jpg"];

  const nextImage = () =>
    setCurrentIndex((prev) => (prev + 1) % images.length);

  const prevImage = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const imageUrl = images[currentIndex].startsWith("http")
    ? images[currentIndex]
    : `${baseUrl}${images[currentIndex]}`;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: theme.cardBackground,
          color: theme.color,
          padding: "2rem",
          borderRadius: "10px",
          width: "90%",
          maxWidth: "600px",
          position: "relative",
          boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            fontSize: "1.5rem",
            background: "none",
            border: "none",
            color: theme.color,
            cursor: "pointer",
          }}
        >
          <FaTimes />
        </button>

        <div
          style={{
            position: "relative",
            marginBottom: "1rem",
            height: "300px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f0f0f0",
            overflow: "hidden",
            borderRadius: "8px",
          }}
        >
          <img
            src={imageUrl}
            alt={product.name}
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            onError={(e) => (e.target.src = "/images/placeholder.jpg")}
          />

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                style={{
                  position: "absolute",
                  left: "10px",
                  background: "rgba(0,0,0,0.4)",
                  border: "none",
                  borderRadius: "50%",
                  padding: "0.5rem",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={nextImage}
                style={{
                  position: "absolute",
                  right: "10px",
                  background: "rgba(0,0,0,0.4)",
                  border: "none",
                  borderRadius: "50%",
                  padding: "0.5rem",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                <FaChevronRight />
              </button>
            </>
          )}
        </div>

        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p style={{ fontWeight: "bold" }}>{parseFloat(product.price).toFixed(2)} €</p>
        {product.specs && <p style={{ fontStyle: "italic" }}>{product.specs}</p>}

        <button
          onClick={() => onAddToCart?.(product)}
          style={{
            marginTop: "1rem",
            width: "100%",
            padding: "0.75rem",
            backgroundColor: theme.buttonBackground,
            color: theme.buttonColor,
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Aggiungi al carrello
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
