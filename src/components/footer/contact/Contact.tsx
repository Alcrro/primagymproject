import React from "react";
import "./contact.scss";
export default function Contact() {
  return (
    <div className="footer-col footer-contact break-words">
      <div className="title">Contact</div>

      <ul className="body">
        <li className="address">
          <span>strada: </span>
          <span> X, </span>
          <span>Satu Mare....</span>
        </li>
        <li className="phone-number">
          <span>telefon: </span>
          <span>+40 0712345678</span>
        </li>
        <li className="email-contact">
          <span>email: </span>
          <span>primagym@primagym.ro</span>
        </li>
      </ul>
    </div>
  );
}
