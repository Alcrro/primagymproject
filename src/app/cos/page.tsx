import { Metadata } from "next";
import Cart from "../../components/cart/Cart";
import React from "react";

export const metadata: Metadata = {
  title: "PrimaGym - Cos",
};

export default function page() {
  return (
    <div className="cart-container">
      <Cart />
    </div>
  );
}
