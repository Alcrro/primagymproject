"use client";
import { ICart } from "@/types/subscription";
import { useAddToCart } from "@/context/addToCart/AddToCartContext";
import React from "react";

export default function ModalCart({ cart }: { cart: ICart }) {
  const { addToCartHandler, removeHandler, deleteHandler } = useAddToCart();
  const qty = cart.quantity ?? 1;

  return (
    <li className="cart-item">
      <div className="cart-item-col cart-item-col--name">
        <span className="cart-item-label">Abonament</span>
        <span className="cart-item-value">{cart.category}</span>
      </div>
      <div className="cart-item-col">
        <span className="cart-item-label">{cart.planType === 'entries' ? 'Intrări' : 'Durată'}</span>
        <span className="cart-item-value">
          {cart.planType === 'entries'
            ? cart.pass
            : `${cart.durationMonths} ${cart.durationMonths === 1 ? 'lună' : 'luni'}`}
        </span>
      </div>
      <div className="cart-item-col">
        <span className="cart-item-label">Cantitate</span>
        <div className="cart-qty-stepper">
          <button type="button" className="qty-btn" onClick={() => removeHandler(cart)} aria-label="Scade">
            <i className="bi bi-dash" />
          </button>
          <span className="qty-value">{qty}</span>
          <button type="button" className="qty-btn" onClick={() => addToCartHandler(cart)} aria-label="Crește">
            <i className="bi bi-plus" />
          </button>
        </div>
      </div>
      <div className="cart-item-col">
        <span className="cart-item-label">Preț/buc</span>
        <span className="cart-item-value">{cart.price} Lei</span>
      </div>
      <div className="cart-item-col">
        <span className="cart-item-label">Total</span>
        <span className="cart-item-value cart-item-value--total">{cart.price * qty} Lei</span>
      </div>
      <button onClick={() => deleteHandler(cart)} aria-label={`Șterge ${cart.category}`} className="cart-item-remove" type="button">
        <i className="bi bi-x-lg" />
      </button>
    </li>
  );
}
