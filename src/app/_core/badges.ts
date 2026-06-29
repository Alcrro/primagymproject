import type { IBadgeDefinition } from '@/types/badges'

export const badgeDefinitions: IBadgeDefinition[] = [
  {
    id: 'first_checkin',
    title: 'Prima intrare',
    description: 'Ai intrat pentru prima dată în sală!',
    condition: 'Realizează primul tău check-in QR',
    icon: '🏃',
  },
  {
    id: 'first_booking',
    title: 'Prima rezervare',
    description: 'Ai rezervat prima ta sesiune de grup!',
    condition: 'Rezervă o sesiune de grup',
    icon: '📅',
  },
  {
    id: 'checkin_5',
    title: '5 intrări',
    description: 'Ai acumulat 5 vizite la sală!',
    condition: 'Realizează 5 check-in-uri',
    icon: '⭐',
  },
  {
    id: 'checkin_10',
    title: '10 intrări',
    description: 'Ai ajuns la 10 vizite!',
    condition: 'Realizează 10 check-in-uri',
    icon: '🌟',
  },
  {
    id: 'checkin_25',
    title: '25 intrări',
    description: 'Regularitatea se vede — 25 de vizite!',
    condition: 'Realizează 25 check-in-uri',
    icon: '💪',
  },
  {
    id: 'checkin_50',
    title: '50 intrări',
    description: 'Jumătate de secol de check-in-uri!',
    condition: 'Realizează 50 check-in-uri',
    icon: '🏆',
  },
  {
    id: 'checkin_100',
    title: 'Centenar',
    description: '100 de intrări — ești un adevărat dedicat!',
    condition: 'Realizează 100 check-in-uri',
    icon: '👑',
  },
  {
    id: 'streak_7',
    title: 'Săptămână de foc',
    description: '7 zile consecutive de check-in!',
    condition: 'Check-in 7 zile la rând',
    icon: '🔥',
  },
  {
    id: 'streak_30',
    title: 'Luna de aur',
    description: '30 de zile consecutive — performanță excepțională!',
    condition: 'Check-in 30 de zile la rând',
    icon: '⚡',
  },
  {
    id: 'explorer',
    title: 'Explorator',
    description: 'Ai explorat toate categoriile de clase!',
    condition: 'Cel puțin un check-in în fiecare categorie',
    icon: '🧭',
  },
]
