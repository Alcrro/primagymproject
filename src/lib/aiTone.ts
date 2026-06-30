export type CommunicationStyle = "prietenos" | "direct" | "motivational" | "tehnic"

export function getToneInstruction(style: string | null | undefined): string {
  switch (style) {
    case "direct":
      return "Ton: răspunsuri scurte și la obiect. Fără introduceri lungi, fără digresiuni. Folosește bullet points când listezi. Nu repeta ce a spus utilizatorul."
    case "motivational":
      return "Ton: energic și încurajator. Pune accent pe beneficii și acțiune. Folosește fraze care inspiră și motivează. Fii entuziast dar nu exagerat."
    case "tehnic":
      return "Ton: detaliat și precis. Explică mecanismele, oferă cifre și date concrete când sunt disponibile. Utilizatorul apreciază profunzimea informației."
    default:
      return "Ton: cald și prietenos, ca o conversație naturală. Poți folosi ocazional emoji. Fii accesibil și răbdător."
  }
}
