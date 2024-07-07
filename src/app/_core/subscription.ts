export interface ICart {
  id: number;
  category: string;
  pass: number;
  price: number;
  description: string;
  student?: boolean;
  holydays?: boolean;
  title: string;
}
export const subscriptions = [
  {
    id: 0,
    category: "zumba",
    pass: 1,
    price: 30,
    description: "",
    title: "abonament start",
  },
  {
    id: 1,
    category: "zumba",
    pass: 4,
    price: 110,
    description: "",
    title: "abonament standard",
  },
  {
    id: 2,
    category: "zumba",
    pass: 8,
    price: 120,
    description: "",
    title: "abonament avansat",
  },
  {
    id: 3,
    category: "zumba",
    pass: 10,
    price: 155,
    description: "",
    title: "abonament premium",
  },
  {
    id: 4,
    category: "fitness",
    pass: 1,
    price: 30,
    student: false,
    description: "",
    title: "",
  },
  {
    id: 5,
    category: "fitness",
    pass: 1,
    student: true,
    price: 20,
    description: "elevi/seniori",
    title: "",
  },

  {
    id: 6,
    category: "fitness",
    pass: 1,
    student: true,
    holydays: true,
    price: 50,
    description: "",
    title: "",
  },
  {
    id: 7,
    category: "fitness",
    pass: 4,
    price: 100,
    description: "",
    title: "",
  },
  {
    id: 8,
    category: "fitness",
    pass: 8,
    price: 150,
    description: "",
    title: "",
  },
  {
    id: 9,
    category: "fitness",
    pass: 10,
    price: 175,
    description: "",
    title: "",
  },
];
