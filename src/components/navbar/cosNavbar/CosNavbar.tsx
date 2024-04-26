"use client";
import React, { useEffect } from "react";
import MenuModal from "../menuModal/MenuModal";
import { useAddToCart } from "@/app/context/addToCart/AddToCartContext";
import { ICart } from "@/app/_core/subscription";
import "./cosNavbarModal.scss";
import Button from "@/components/button/Button";
export default function CosNavbar({ menu }: { menu: any }) {
  const { addToCart, setAddToCart } = useAddToCart();

  const removeHandler = (sub: any) => {
    const cart: any = addToCart;

    const findIndex = cart.findIndex(
      (findIndex: any) => findIndex.id === sub.id
    );

    if (findIndex >= 0) {
      cart.splice(findIndex, 1);
      setAddToCart((list) => [...list]);
      localStorage.setItem("cart", JSON.stringify(cart) || "[]");
    } else {
    }
  };

  return (
    <MenuModal className={menu.link}>
      {/* <div className="cos-modal-header">Cos</div> */}
      <div className="cos-modal-body">
        <ul className="ul-cos">
          {addToCart.map((sub: ICart, key) => (
            <li key={key} className="li-cos">
              <div className="subscription-description">
                <div>abonament: </div>
                {sub.category}
              </div>
              <div className="pass">
                <div>Intrari: </div>
                {sub.pass}
              </div>
              <div className="price">
                <div>pret: </div>
                {sub.price}
              </div>
              <div className="delete" onClick={() => removeHandler(sub)}>
                <span>X</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="cos-modal-footer">
        <div className="total">
          <span>Total: </span>
          {addToCart.reduce(
            (total: any, curr: any) => (total += curr.price),
            0
          )}{" "}
          <span>RON</span>
        </div>
        <Button title="Cumpara" className="checkout text-white" />
      </div>
    </MenuModal>
  );
}
