export interface ICart {
  id: number;
  category: string;
  pass: number;
  price: number;
  description: string;
  student?: boolean;
  holydays?: boolean;
}
export const subscriptions = [
  {
    id: 0,
    category: "zumba",
    pass: 1,
    price: 30,
    description: "",
  },
  {
    id: 1,
    category: "zumba",
    pass: 4,
    price: 100,
    description: "",
  },
  {
    id: 2,
    category: "zumba",
    pass: 8,
    price: 150,
    description: "",
  },
  { id: 3, category: "zumba", pass: 10, price: 175, description: "" },
  {
    id: 4,
    category: "fitness",
    pass: 1,
    price: 30,
    student: false,
    description: "",
  },
  {
    id: 5,
    category: "fitness",
    pass: 1,
    student: true,
    price: 20,
    description: "",
  },

  {
    id: 6,
    category: "fitness",
    pass: 1,
    student: true,
    holydays: true,
    price: 50,
    description: "",
  },
  { id: 7, category: "fitness", pass: 4, price: 100, description: "" },
  { id: 8, category: "fitness", pass: 8, price: 150, description: "" },
  { id: 9, category: "fitness", pass: 10, price: 175, description: "" },
];
