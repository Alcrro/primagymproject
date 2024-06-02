"use client";
import { ICart } from "@/app/_core/subscription";
import React from "react";

interface IModalCart {
  cart: ICart;
}

export default function ModalCart({ cart }: IModalCart) {
  return (
    <div key={cart?.id} className="flex gap-4 justify-between">
      <div>
        <span>Abonament: </span>
        <li className="block text-center">{cart?.category}</li>
      </div>

      <div>
        <span>Intrari: </span>
        <li className="block text-center">{cart?.pass}</li>
      </div>
      <div>
        <span>Pret: </span>
        <li className="block text-center">{cart?.price}</li>
      </div>
    </div>
  );
}
