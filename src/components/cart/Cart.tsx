"use client";
import React, { useEffect, useState } from "react";
import ModalCart from "./modalCart/ModalCart";
import "./cart.scss";
import { ICart } from "@/app/_core/subscription";
export default function Cart() {
  const [cart, setCart] = useState([]);
  useEffect(() => {
    const getCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(getCart);
  }, []);

  return (
    <div className="cart-container-inner">
      <div className="cart-title">
        <div className="title">Cos</div>
      </div>
      <div className="cart-inner">
        <div className="cart-body">
          <ul className="ul-cart">
            {cart.map((item: ICart, key) => (
              <ModalCart cart={item} key={key} />
            ))}
          </ul>
        </div>
        <div className="cart-footer p-2">
          <div className="total-price flex justify-between">
            <div className="title-price">Total:</div>
            <div className="price">
              <span>
                {cart.reduce(
                  (total, acc: ICart) => (total = total + acc.price),
                  0
                )}
              </span>
              <span> Lei</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
