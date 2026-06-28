"use client";
import React, { useState } from "react";
import ModalCart from "./modalCart/ModalCart";
import { useAddToCart } from "@/context/addToCart/AddToCartContext";
import { applyDiscountCodeAction } from "@/app/actions/discount";
import Link from "next/link";
import "./cart.scss";

export default function Cart({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { addToCart } = useAddToCart();

  const subtotal = addToCart.reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [discountRon, setDiscountRon] = useState(0);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const total = Math.max(0, subtotal - discountRon);

  async function applyDiscountHandler() {
    setDiscountError(null);
    setIsApplying(true);
    const result = await applyDiscountCodeAction(discountCode, subtotal);
    setIsApplying(false);
    if (result.error) {
      setDiscountError(result.error);
      setDiscountRon(0);
      setAppliedCode("");
    } else {
      setDiscountRon(result.discountRon);
      setAppliedCode(discountCode.trim().toUpperCase());
    }
  }

  async function checkoutHandler() {
    if (!isLoggedIn) {
      window.location.href = "/login?callbackUrl=/cos";
      return;
    }
    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: addToCart, discountCode: appliedCode || undefined }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setIsCheckingOut(false);
    }
  }

  if (addToCart.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-container-inner">
          <div className="title">Coș</div>
          <p className="cart-empty">Coșul tău este gol.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-layout">
        <div className="cart-container-inner">
          <div className="title">Coș</div>
          <ul className="ul-cart">
            {addToCart.map((item) => (
              <ModalCart cart={item} key={item.id} />
            ))}
          </ul>
        </div>

        <aside className="cart-summary">
          <div className="summary-title">Sumar comandă</div>
          <div className="summary-discount">
            <input
              type="text"
              className="discount-input"
              placeholder="Cod de reducere"
              value={discountCode}
              onChange={(e) => {
                setDiscountCode(e.target.value);
                if (discountError) setDiscountError(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && applyDiscountHandler()}
              disabled={!!appliedCode}
            />
            {appliedCode ? (
              <button
                type="button"
                className="discount-btn discount-btn--remove"
                onClick={() => { setAppliedCode(""); setDiscountRon(0); setDiscountCode(""); }}
              >
                Elimină
              </button>
            ) : (
              <button
                type="button"
                className="discount-btn"
                onClick={applyDiscountHandler}
                disabled={isApplying || !discountCode.trim()}
              >
                {isApplying ? "..." : "Aplică"}
              </button>
            )}
          </div>
          {discountError && <p className="discount-error">{discountError}</p>}
          {appliedCode && <p className="discount-success">Cod &bdquo;{appliedCode}&rdquo; aplicat</p>}

          <div className="summary-rows">
            <div className="summary-row">
              <span className="summary-label">Subtotal</span>
              <span className="summary-value">{subtotal} Lei</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Reducere</span>
              <span className={`summary-value${discountRon ? " summary-value--discount" : " summary-value--muted"}`}>
                {discountRon ? `- ${discountRon} Lei` : "—"}
              </span>
            </div>
            <div className="summary-row summary-row--total">
              <span className="summary-label">Total</span>
              <span className="summary-value">{total} Lei</span>
            </div>
          </div>

          {!isLoggedIn && (
            <p className="cart-login-notice">
              <i className="bi bi-lock" />
              Autentifică-te pentru a finaliza comanda.{" "}
              <Link href="/login?callbackUrl=/cos">Intră în cont</Link>
            </p>
          )}

          <button
            className="summary-checkout"
            type="button"
            onClick={checkoutHandler}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? "Se procesează..." : "Finalizează comanda"}
            {!isCheckingOut && <i className="bi bi-arrow-right" />}
          </button>
        </aside>
      </div>
    </div>
  );
}
