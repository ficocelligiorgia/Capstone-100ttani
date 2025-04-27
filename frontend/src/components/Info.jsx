import React from "react";

const cardStyle = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  padding: "2rem",
  marginBottom: "2rem",
};

const containerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "2rem",
};

const titleStyle = {
  fontSize: "2rem",
  fontWeight: "bold",
  marginBottom: "1rem",
};

const textStyle = {
  fontSize: "1.125rem",
  lineHeight: "1.75rem",
  color: "#333",
};

const Info = () => {
  return (
    <div style={containerStyle}>
    
      <div style={cardStyle}>
        <h2 style={titleStyle}>Chi siamo</h2>
        <p style={textStyle}>
          I <strong>100ttani Moto Club</strong> sono un gruppo di motociclisti romani accomunati dalla passione per la strada,
          le moto e l’amicizia. Ogni uscita è un’occasione per vivere nuove avventure, tra curve, risate e paesaggi mozzafiato.
        </p>
      </div>

      
      <div style={cardStyle}>
        <h2 style={titleStyle}>Amministratori del gruppo</h2>
        <ul style={{ ...textStyle, listStyleType: "none", padding: 0 }}>
          <li>Luca</li>
          <li>Francesco</li>
          <li>Michela</li>
          <li>Luis</li>
          <li>Riccardo</li>
        </ul>
      </div>

      
      <div style={cardStyle}>
        <h2 style={titleStyle}>Dove ci trovi</h2>
        <p style={textStyle}>
          La nostra base è <strong>Roma</strong>, ma ci trovi ovunque ci siano curve da affrontare: dai Castelli Romani al Terminillo,
          passando per la Toscana e oltre. Ritrovo? Di solito un benzinaio con un buon caffè!
        </p>
      </div>

     
      <div style={cardStyle}>
        <h2 style={titleStyle}>Contatti</h2>
        <p style={textStyle}>Vuoi unirti a noi o sapere delle prossime uscite? Seguici qui:</p>
        <ul style={{ ...textStyle, listStyleType: "none", padding: 0, marginTop: "1rem" }}>
          <li>
            <a href="https://chat.whatsapp.com/EtEtsQ9G6G75kI0L7fr8k4?utm_campaign=linkinbio&utm_medium=referral&utm_source=later-linkinbio" 
              target="_blank" rel="noopener noreferrer" style={{ color: "#0077cc", textDecoration: "underline" }}>
              Gruppo WhatsApp
            </a>
          </li>
          <li style={{ marginTop: "0.5rem" }}>
            <a href="https://www.instagram.com/100ttani_motoclub?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
              target="_blank" rel="noopener noreferrer" style={{ color: "#d63384", textDecoration: "underline" }}>
              Pagina Instagram
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Info;
