export interface ITestimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  rating: number;
}

export const testimoniale: ITestimonial[] = [
  {
    id: 1,
    name: "Andreea M.",
    role: "Membră Zumba · 2 ani",
    text: "Am încercat mai multe săli, dar la ApexFit am găsit ceea ce căutam: instructori pasionați, atmosferă prietenoasă și orar flexibil. Zumba de miercuri seara e highlight-ul săptămânii mele!",
    rating: 5,
  },
  {
    id: 2,
    name: "Bogdan T.",
    role: "Membru Fitness · 1 an",
    text: "Sala de fitness e curată, bine dotată și niciodată supraaglomerată. Antrenorul meu personal mi-a creat un program adaptat obiectivelor mele și am slăbit 12 kg în 6 luni.",
    rating: 5,
  },
  {
    id: 3,
    name: "Mihaela P.",
    role: "Membră Cycling · 8 luni",
    text: "Clasele de cycling sunt extrem de motivante. Muzica, instructorul și energia grupului te fac să uiți că e greu. Recomand cu toată inima oricui vrea să scape de stres!",
    rating: 5,
  },
];
