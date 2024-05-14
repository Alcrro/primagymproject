"use client";
import Button from "@/components/button/Button";
import { useAddToCart } from "@/context/addToCart/AddToCartContext";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function SubscriptionCard({
  category,
  imageCard,
}: {
  category: any;
  imageCard: any;
}) {
  const { addToCart, setAddToCart, addToCartHandler } = useAddToCart();

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
            <div className="pass"> {category.pass} intrare </div>
          ) : (
            <div className="pass"> {category.pass} intrari</div>
          )}
          <div className="price">{category.price} RON</div>
        </div>

        <div className="footer">
          <Button
            title="Doresc abonament"
            className="add-to-cart"
            handleClick={() => addToCartHandler(category)}
          />
        </div>
      </div>
    </>
  );
}
