import React from "react";

function Footer() {
  const d = new Date();
  const day = d.getFullYear();
  return (
    <footer>
      <p className="footer">Copyright @ {day}</p>
    </footer>
  );
}
export default Footer;
