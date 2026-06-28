"use client";
import React, { useEffect, useState } from "react";
import "./notifiedCos.scss";
import { useAddToCart } from "@/context/addToCart/AddToCartContext";
interface INotifiedCos {
  active?: string;
}

export default function NotifiedCos({ active }: INotifiedCos) {
  const { addToCart } = useAddToCart();
  const totalQty = addToCart.reduce((sum, item) => sum + (item.quantity ?? 1), 0);

  if (totalQty > 0) {
    return (
      <div
        className={`notified-cos-container${!active ? " inActive" : " active"}`}
      >
        {totalQty}
      </div>
    );
  }
}
