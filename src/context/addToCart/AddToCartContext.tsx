"use client";

import { ICart } from "@/app/_core/subscription";
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
  removeHandler: (sub: ICart) => void;
  addToCartHandler: (sub: any) => void;
}

const AddToCartContext = createContext<IAddToCartProps>({
  addToCart: [],
  setAddToCart: () => [],
  removeHandler: () => undefined,
  addToCartHandler: () => undefined,
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

  const removeHandler = (sub: ICart) => {
    console.log(sub);

    const cart: any = addToCart;
    // console.log(cart);

    const findIndex = cart.findIndex(
      (findIndex: any) => findIndex.id === sub.id
    );

    if (findIndex >= 0) {
      addToCart.splice(findIndex, 1);
      setAddToCart((list) => [...list]);
      localStorage.setItem("cart", JSON.stringify(cart) || "[]");
    } else {
    }
  };

  const addToCartHandler = (category: any) => {
    let cart: any = [...addToCart, category];

    setAddToCart(cart);
    localStorage.setItem("cart", JSON.stringify(cart) || "[]");
  };
  return (
    <AddToCartContext.Provider
      value={{ addToCart, setAddToCart, removeHandler ,addToCartHandler}}
    >
      {children}
    </AddToCartContext.Provider>
  );
}

export const useAddToCart = () => useContext(AddToCartContext);
