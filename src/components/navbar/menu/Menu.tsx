"use client";
import Link from "next/link";
import React, { Dispatch, SetStateAction, useState } from "react";

import "./menu.scss";
import { menuNavbar } from "@/app/_core/navbarMenu";
import MenuModal from "../menuModal/MenuModal";
import { subscriptionCategory } from "@/app/_core/subscriptionCategories";
import CosNavbar from "../cosNavbar/CosNavbar";
import NotifiedCos from "../cosNavbar/NotifiedCos";
import { useAddToCart } from "@/app/context/addToCart/AddToCartContext";

interface IMenuProps {
  active?: string;
  setActive?: Dispatch<SetStateAction<boolean>> | any;
}

export default function Menu({ active, setActive }: IMenuProps) {
  const { addToCart } = useAddToCart();
  return (
    <li className={`menu-container ${active}`}>
      <ul>
        {menuNavbar.map((menu, key) => (
          <li key={key} className={`li-${menu.link}`}>
            <Link href={`/${menu.link}`}>
              {active ? (
                <>
                  {menu.link === "cos" ? <NotifiedCos active={active} /> : null}
                  <span
                    className={menu.link}
                    onClick={() => setActive((prev: any) => !prev)}
                  >
                    {menu.category}
                  </span>
                </>
              ) : (
                <>
                  {menu.link === "cos" ? <NotifiedCos /> : null}
                  <span className={menu.link}> {menu.category}</span>
                </>
              )}
            </Link>
            {menu.modal && menu.link === "abonamente" ? (
              <MenuModal className={menu.link}>
                <ul>
                  {subscriptionCategory.map((category, key) => (
                    <li key={key}>
                      <Link href={`/${menu.link}/${category}`}>
                        <span onClick={() => setActive((prev: any) => !prev)}>
                          {category}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </MenuModal>
            ) : menu.modal && menu.link === "cos" && addToCart.length > 0 ? (
              <>
                <CosNavbar menu={menu} />
              </>
            ) : null}
          </li>
        ))}
      </ul>
    </li>
  );
}
