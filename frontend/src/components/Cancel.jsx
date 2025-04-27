import React from "react";

export default function Cancel({ theme }) {
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
      <h1> Pagamento annullato</h1>
      <p>Hai annullato il processo di pagamento. Puoi riprovare quando vuoi.</p>
    </div>
  );
}
