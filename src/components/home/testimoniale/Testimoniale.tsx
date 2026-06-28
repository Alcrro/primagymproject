import React from "react";
import { testimoniale } from "@/app/_core/testimoniale";
import "./testimoniale.scss";

export default function Testimoniale() {
  return (
    <section className="test-container">
      <div className="test-header">
        <h2 className="test-title">Ce spun membrii noștri</h2>
        <p className="test-subtitle">Experiențe reale din comunitatea ApexFit.</p>
      </div>
      <div className="test-grid">
        {testimoniale.map((t) => (
          <div key={t.id} className="test-card">
            <div className="test-stars" aria-label={`${t.rating} stele`}>
              {"★".repeat(t.rating)}
            </div>
            <p className="test-text">&ldquo;{t.text}&rdquo;</p>
            <div className="test-author">
              <div className="test-avatar" aria-hidden="true">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="test-name">{t.name}</p>
                <p className="test-role">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
