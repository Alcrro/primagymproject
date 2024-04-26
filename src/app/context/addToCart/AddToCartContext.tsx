"use client";

import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface IAddToCartProps {
  addToCart: [];
  setAddToCart: Dispatch<SetStateAction<[]>>;
}

const AddToCartContext = createContext<IAddToCartProps>({
  addToCart: [],
  setAddToCart: () => [],
});

export default function AddToCartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [addToCart, setAddToCart] = useState<[]>([]);

  useEffect(() => {
    const load = JSON.parse(localStorage.getItem("cart") || "[]");

    setAddToCart(load);
  }, []);
  return (
    <AddToCartContext.Provider value={{ addToCart, setAddToCart }}>
      {children}
    </AddToCartContext.Provider>
  );
}

export const useAddToCart = () => useContext(AddToCartContext);
