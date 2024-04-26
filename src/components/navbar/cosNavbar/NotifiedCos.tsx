"use client";
import React, { useEffect, useState } from "react";
import "./notifiedCos.scss";
import { useAddToCart } from "../../../app/context/addToCart/AddToCartContext";
interface INotifiedCos {
  active?: string;
}
export default function NotifiedCos({ active }: INotifiedCos) {
  const { addToCart, setAddToCart } = useAddToCart();

  if (addToCart.length > 0) {
    return (
      <div
        className={`notified-cos-container${!active ? " inActive" : " active"}`}
      >
        {addToCart.length}
      </div>
    );
  }
}
