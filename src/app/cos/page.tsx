import Cart from "../../components/cart/Cart";
import React from "react";
export const dynamic = "force-dynamic";
export default function page() {
  return (
    <div className="cart-container">
      <Cart />
    </div>
  );
}
