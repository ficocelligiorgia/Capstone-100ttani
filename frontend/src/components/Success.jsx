import React, { useEffect } from "react";

export default function Success({ theme }) {
  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    if (cartItems.length > 0) {
      fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: cartItems }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(" Ordine salvato:", data);
          localStorage.removeItem("cartItems"); 
        })
        .catch((err) => {
          console.error(" Errore salvataggio ordine:", err);
        });
    }
  }, []);

  return (
    <div
      style={{
        padding: "4rem",
        textAlign: "center",
        backgroundColor: theme.background,
        color: theme.color,
        minHeight: "100vh",
      }}
    >
      <h1>🎉 Grazie per il tuo ordine!</h1>
      <p>Il tuo pagamento è stato completato e il tuo ordine è stato salvato.</p>
    </div>
  );
}
