"use client";
import { useEffect } from "react";
import { useAddToCart } from "@/context/addToCart/AddToCartContext";
import Link from "next/link";
import "./succes.scss";

export default function SuccesPage() {
  const { clearCartHandler } = useAddToCart();

  useEffect(() => {
    clearCartHandler();
  }, []);

  return (
    <div className="succes-container">
      <div className="succes-card">
        <div className="succes-icon">
          <i className="bi bi-check-circle-fill" />
        </div>
        <h1 className="succes-title">Plată confirmată!</h1>
        <p className="succes-desc">
          Comanda ta a fost înregistrată cu succes. Vei primi un email de
          confirmare în scurt timp.
        </p>
        <Link href="/abonamente" className="succes-btn">
          Explorează abonamente
          <i className="bi bi-arrow-right" />
        </Link>
      </div>
    </div>
  );
}
