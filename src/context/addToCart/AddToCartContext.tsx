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

export interface IAddToCart {
  id: number;
  category: string;
  pass: number;
  price: number;
  description: string;
  student?: boolean;
  holydays?: boolean;
  count: number;
  title: string;
}

interface IAddToCartProps {
  addToCart: IAddToCart[];
  setAddToCart: Dispatch<SetStateAction<IAddToCart[]>>;
  removeHandler: (sub: any) => void;
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
  const [addToCart, setAddToCart] = useState<IAddToCart[]>([]);

  useEffect(() => {
    const load = JSON.parse(localStorage.getItem("cart") || "[]");

    setAddToCart(load);
  }, []);

  const removeHandler = (sub: ICart) => {


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

  const addToCartHandler = (category: ICart) => {
    const findIndex = addToCart.findIndex(
      (findIndex: IAddToCart) => findIndex.id === category.id
    );

    if (findIndex >= 0) {
      addToCart[findIndex].count += 1;
      setAddToCart((list: any) => [...list]);
      localStorage.setItem("cart", JSON.stringify(addToCart) || "[]");
    } else {
      const item = {
        ...category,
        count: 1,
      };

      let cart: any = [...addToCart, item];
      setAddToCart(cart);
      localStorage.setItem("cart", JSON.stringify(cart) || "[]");
    }
  };
  return (
    <AddToCartContext.Provider
      value={{ addToCart, setAddToCart, removeHandler, addToCartHandler }}
    >
      {children}
    </AddToCartContext.Provider>
  );
}

export const useAddToCart = () => useContext(AddToCartContext);
