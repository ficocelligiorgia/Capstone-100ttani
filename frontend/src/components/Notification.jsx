import React from "react";

function Notification({ message, type }) {
  if (!message) return null;

  const styles = {
    padding: "1rem",
    margin: "1rem 0",
    borderRadius: "8px",
    fontWeight: "bold",
    color: type === "success" ? "#155724" : "#721c24",
    backgroundColor: type === "success" ? "#d4edda" : "#f8d7da",
    border: `1px solid ${type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
    textAlign: "center",
  };

  return <div style={styles}>{message}</div>;
}

export default Notification;
