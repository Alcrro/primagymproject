import React from "react";
import SocialMedia from "./socialMedia/SocialMedia";
import "./footer.scss";
import Information from "./information/Information";
import Rules from "./regulament/Rules";
import FooterModal from "./footerModal/FooterModal";
import { rules } from "@/app/_core/rules";
import { information } from "@/app/_core/information";
export default function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-inner">
        <FooterModal
          props={information}
          title="Informatii"
          className="informatii"
        />
        <FooterModal props={rules} title="Regulament" className="regulament" />
        <SocialMedia />
      </div>
    </div>
  );
}
