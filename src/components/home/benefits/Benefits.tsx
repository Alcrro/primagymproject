import React from "react";
import "./benefits.scss";

interface IBenefit {
  icon: string;
  title: string;
  description: string;
}

const benefits: IBenefit[] = [
  {
    icon: "🏋️",
    title: "Echipamente moderne",
    description:
      "Săli dotate cu aparatură de ultimă generație, întreținute și actualizate regulat pentru o experiență de antrenament optimă.",
  },
  {
    icon: "👨‍🏫",
    title: "Instructori certificați",
    description:
      "Echipa noastră de antrenori este certificată internațional și pregătită să te ghideze indiferent de nivel — începător sau avansat.",
  },
  {
    icon: "📅",
    title: "Program flexibil",
    description:
      "Clase de grup și fitness disponibile dimineața, la prânz și seara. Găsești mereu un orar potrivit stilului tău de viață.",
  },
  {
    icon: "🤝",
    title: "Comunitate motivantă",
    description:
      "La ApexFit nu vii singur. Fie că alegi Zumba, Cycling sau sala de fitness, vei fi înconjurat de oameni cu aceleași obiective.",
  },
];

export default function Benefits() {
  return (
    <section className="ben-container">
      <div className="ben-header">
        <h2 className="ben-title">De ce ApexFit?</h2>
        <p className="ben-subtitle">
          Peste 10 ani de experiență în fitness — iată ce ne face diferiți.
        </p>
      </div>
      <div className="ben-grid">
        {benefits.map((b) => (
          <div key={b.title} className="ben-card">
            <span className="ben-icon" aria-hidden="true">{b.icon}</span>
            <h3 className="ben-card-title">{b.title}</h3>
            <p className="ben-card-desc">{b.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
