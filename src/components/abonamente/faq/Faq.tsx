import React from 'react';
import './faq.scss';

const faqs = [
  {
    q: 'Ce se întâmplă dacă ratez antrenamente?',
    a: 'Absențele nu scad din abonamentul pe luni. Dacă ai o situație specială (boală, deplasare), contactează recepția pentru a discuta opțiunile disponibile.',
  },
  {
    q: 'Pot îngheța abonamentul?',
    a: 'Da, abonamentele lunare pot fi înghețate la cerere pentru o perioadă limitată. Adresează-te recepției cu cel puțin 24h înainte de data dorită.',
  },
  {
    q: 'Cum funcționează abonamentele pe intrări?',
    a: 'Fiecare vizită scade o intrare din pachetul ales. Intrările nu expiră — le poți folosi în ritmul tău, fără presiunea unui termen limită.',
  },
  {
    q: 'Pot combina mai multe categorii cu același abonament?',
    a: 'Fiecare abonament este valabil pentru o singură categorie (ex: zumba, fitness). Pentru acces la mai multe discipline, sunt necesare abonamente separate.',
  },
];

export default function Faq() {
  return (
    <section className="faq-section">
      <h2 className="faq-title">Întrebări frecvente</h2>
      <div className="faq-list">
        {faqs.map((item) => (
          <div key={item.q} className="faq-item">
            <p className="faq-question">{item.q}</p>
            <p className="faq-answer">{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
