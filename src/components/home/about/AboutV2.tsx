import React from "react";
import "./aboutV2.scss";

interface IAboutCard {
  number: string;
  title: string;
  description: string;
}

const cards: IAboutCard[] = [
  {
    number: "01",
    title: "Povestea noastră",
    description:
      "ApexFit a luat naștere din pasiunea pentru mișcare și dorința de a crea un spațiu în care fiecare persoană să se simtă binevenită. De la primele clase de aerobic până la sălile moderne de fitness și cycling de astăzi, am crescut alături de membrii noștri.",
  },
  {
    number: "02",
    title: "Misiunea noastră",
    description:
      "Credem că un stil de viață activ trebuie să fie accesibil tuturor. Misiunea noastră este să oferim antrenamente de calitate, instructori dedicați și un mediu motivant — indiferent de nivelul tău de experiență sau obiectivele pe care ți le-ai propus.",
  },
  {
    number: "03",
    title: "Comunitatea ApexFit",
    description:
      "La ApexFit nu vii doar să te antrenezi — faci parte dintr-o comunitate. Zumba, H.I.I.T., cycling sau fitness: oriunde alegi să începi, vei găsi oameni care te susțin și instructori care te ghidează la fiecare pas.",
  },
];

export default function AboutV2() {
  return (
    <section className="av2-container">
      <div className="av2-grid">
        {cards.map((card) => (
          <div key={card.number} className="av2-card">
            <span className="av2-number">{card.number}</span>
            <h3 className="av2-title">{card.title}</h3>
            <p className="av2-description">{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
