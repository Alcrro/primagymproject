"use client";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";
import "./menu.scss";

import MenuModal from "../menuModal/MenuModal";
import { subscriptionCategory } from "../../../app/_core/subscriptionCategories";
import CosNavbar from "../cosNavbar/CosNavbar";
import NotifiedCos from "../cosNavbar/NotifiedCos";
import { useAddToCart } from "../../../context/addToCart/AddToCartContext";

interface IMenuProps {
  active?: string;
  setActive?: Dispatch<SetStateAction<boolean>> | any;
  onHoverHandler?: Dispatch<SetStateAction<boolean>> | any;
  menu: [];
  onHoverActive?: boolean;
}

export default function Menu({
  active,
  setActive,
  menu,
  onHoverHandler,
}: IMenuProps) {
  const { addToCart } = useAddToCart();

  const ggHandler = () => {
    setActive((prev: any) => !prev);
  };

  return (
    <li className={`menu-container ${active}`}>
      <ul>
        {menu.map((menu: any, key: any) => (
          <li key={key} className={`li-${menu.link}`}>
            <Link href={`/${menu.link}`}>
              {active ? (
                <>
                  {menu.link === "cos" ? <NotifiedCos active={active} /> : null}
                  <span
                    className={menu.link}
                    onClick={ggHandler}
                    onMouseEnter={onHoverHandler}
                    onMouseLeave={onHoverHandler}
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
                      <Link href={`/${menu.link}/${category.link}`}>
                        <span>{category.name}</span>
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
