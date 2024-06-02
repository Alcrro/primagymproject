import React, { Suspense } from "react";
import SocialMedia from "./socialMedia/SocialMedia";
import "./footer.scss";
import FooterModal from "./footerModal/FooterModal";
import { getInformation } from "../../app/_lib/footer/getInformation/getInformation";
import { getRules } from "../../app/_lib/footer/getRules/getRules";
import Contact from "./contact/Contact";
import Program from "./program/Program";

export default async function Footer() {
  const gInformation: Promise<[]> = getInformation();
  const gRules: Promise<[]> = getRules();

  const [information, rules] = await Promise.all([gInformation, gRules]);

  return (
    <div className="footer-container">
      <div className="footer-inner">
        <Contact />
        <Program />
        <Suspense>
          <FooterModal
            props={information}
            title="Informatii"
            className="informatii"
          />
        </Suspense>
        <Suspense>
          <FooterModal
            props={rules}
            title="Regulament"
            className="regulament"
          />
        </Suspense>
      </div>
      <SocialMedia />
    </div>
  );
}
