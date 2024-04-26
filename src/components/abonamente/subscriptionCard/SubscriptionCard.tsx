"use client";
import useLocalStorage from "@/app/_lib/addToLocalStorage/AddToLocalStorage";
import { useAddToCart } from "../../../app/context/addToCart/AddToCartContext";
import Button from "@/components/button/Button";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function SubscriptionCard({
  category,
  imageCard,
}: {
  category: any;
  imageCard: any;
}) {
  const { addToCart, setAddToCart } = useAddToCart();
  const addToCartHandler = () => {
    let cart: any = [...addToCart, category];

    setAddToCart(cart);
    localStorage.setItem("cart", JSON.stringify(cart) || "[]");
  };

  return (
    <>
      <Image
        src={imageCard}
        alt="fitness card"
        height={300}
        width={500}
        className="m-auto rounded-lg h-[420px]"
      />
      <div className="text-container">
        <div className="header">Abonament {category.category} </div>
        <div className="body">
          {category.pass < 2 ? (
            <div className="pass"> {category.pass} intare </div>
          ) : (
            <div className="pass"> {category.pass} intrari</div>
          )}
          <div className="price">{category.price} RON</div>
        </div>

        <div className="footer">
          <Button
            title="Doresc abonament"
            className="add-to-cart"
            handleClick={addToCartHandler}
          />
        </div>
      </div>
    </>
  );
}
