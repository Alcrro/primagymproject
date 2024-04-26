export interface IAntrenorProfile {
  id: number;
  name: string;
  category: string;
  thumbnail: string;
  age: number;
  description: string;
}
export const trainers: IAntrenorProfile[] = [
  {
    id: 1,
    name: "alex",
    category: "nimic",
    thumbnail: "eu",
    age: 29,
    description: "The best trainer",
  },
  {
    id: 2,
    name: "alexandra",
    category: "zumba",
    thumbnail: "",
    age: 22,
    description: "The best trainer",
  },
  {
    id: 3,
    name: "andreea",
    category: "cycling",
    thumbnail: "",
    age: 24,
    description: "The best trainer",
  },
  {
    id: 4,
    name: "malina",
    category: "zumba",
    thumbnail: "",
    age: 32,
    description: "The best trainer",
  },
  {
    id: 5,
    name: "dom",
    category: "fitness",
    thumbnail: "",
    age: 42,
    description: "The best trainer",
  },
];
