import React from "react";

const Footer = () => {
    return (
      <div>
        <div style={{ marginBottom: "100px"  }}></div>
        <footer style={footerStyle}>
          <p>Copyright &copy; 2023 Nepele. All rights reserved</p>
        </footer>
      </div>
    );
  };
  
  const footerStyle = {
    backgroundColor: "#333",
    color: "#fff",
    textAlign: "center",
    padding: "1rem",
    bottom: 0,
  };

export default Footer;
