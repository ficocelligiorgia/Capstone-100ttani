import React from "react";

function ProductCard({ product, onSelect, onDelete, onAddToCart, userRole, theme }) {
  const isAdmin = userRole === "admin" || userRole === "staff";
  const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const imagePath = product?.images?.length > 0 ? product.images[0] : null;

  const imageUrl = imagePath
    ? imagePath.startsWith("http")
      ? imagePath
      : `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`
    : "/images/placeholder.jpg";

  return (
    <div
      onClick={() => onSelect(product)}
      style={{
        cursor: "pointer",
        border: `1px solid ${theme.borderColor}`,
        borderRadius: "8px",
        padding: "1rem",
        backgroundColor: theme.cardBackground,
        color: theme.color,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        position: "relative",
        width: "100%",
        maxWidth: "240px",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "200px",
          backgroundColor: "#f5f5f5",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "1rem",
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        <img
          src={imageUrl}
          alt={product.name}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
          onError={(e) => {
            if (!e.target.src.includes("placeholder.jpg")) {
              e.target.src = "/images/placeholder.jpg";
            }
          }}
        />
      </div>

      <h3
        style={{
          margin: "0.5rem 0",
          fontSize: "1rem",
          textAlign: "center",
          color: theme.color,
        }}
      >
        {product.name}
      </h3>

      <p style={{ color: "crimson", fontWeight: "bold" }}>
        {parseFloat(product.price).toFixed(2)} €
      </p>

      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart(product);
        }}
        style={{
          marginTop: "0.5rem",
          padding: "0.4rem 1rem",
          backgroundColor: "crimson",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontSize: "0.9rem",
          cursor: "pointer",
        }}
      >
        Aggiungi al carrello
      </button>

      {isAdmin && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(product._id);
          }}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "#c10000",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "0.3rem 0.6rem",
            cursor: "pointer",
            fontSize: "1rem",
          }}
          title="Elimina prodotto"
        >
          🗑
        </button>
      )}
    </div>
  );
}

export default ProductCard;
