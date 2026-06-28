"use client";

import { ICart } from "@/types/subscription";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface IAddToCartProps {
  addToCart: ICart[];
  setAddToCart: Dispatch<SetStateAction<ICart[]>>;
  removeHandler: (sub: ICart) => void;
  deleteHandler: (sub: ICart) => void;
  addToCartHandler: (sub: ICart) => void;
  clearCartHandler: () => void;
}

const AddToCartContext = createContext<IAddToCartProps>({
  addToCart: [],
  setAddToCart: () => {},
  removeHandler: () => undefined,
  deleteHandler: () => undefined,
  addToCartHandler: () => undefined,
  clearCartHandler: () => undefined,
});

export default function AddToCartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [addToCart, setAddToCart] = useState<ICart[]>([]);

  useEffect(() => {
    const raw: ICart[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const map = new Map<number, ICart>();
    for (const item of raw) {
      const prev = map.get(item.id);
      if (prev) {
        map.set(item.id, { ...prev, quantity: (prev.quantity ?? 1) + (item.quantity ?? 1) });
      } else {
        map.set(item.id, { ...item, quantity: item.quantity ?? 1 });
      }
    }
    setAddToCart(Array.from(map.values()));
  }, []);

  const deleteHandler = (sub: ICart) => {
    const updated = addToCart.filter((item) => item.id !== sub.id);
    setAddToCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeHandler = (sub: ICart) => {
    const updated = addToCart
      .map((item) =>
        item.id === sub.id ? { ...item, quantity: (item.quantity ?? 1) - 1 } : item
      )
      .filter((item) => (item.quantity ?? 1) > 0);
    setAddToCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const clearCartHandler = () => {
    setAddToCart([]);
    localStorage.removeItem("cart");
  };

  const addToCartHandler = (category: ICart) => {
    const exists = addToCart.find((item) => item.id === category.id);
    const cart = exists
      ? addToCart.map((item) =>
          item.id === category.id
            ? { ...item, quantity: (item.quantity ?? 1) + 1 }
            : item
        )
      : [...addToCart, { ...category, quantity: 1 }];
    setAddToCart(cart);
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  return (
    <AddToCartContext.Provider
      value={{ addToCart, setAddToCart, removeHandler, deleteHandler, addToCartHandler, clearCartHandler }}
    >
      {children}
    </AddToCartContext.Provider>
  );
}

export const useAddToCart = () => useContext(AddToCartContext);
