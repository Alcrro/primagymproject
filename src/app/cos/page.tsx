import { Metadata } from "next";
import Cart from "../../components/cart/Cart";
import React from "react";

export const metadata: Metadata = {
  title: "Gym - Cos",
};

export default function page() {
  return (
    <div className="cart-container">
      <Cart />
    </div>
  );
}
