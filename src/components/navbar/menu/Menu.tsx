"use client";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";
import "./menu.scss";

import MenuModal from "../menuModal/MenuModal";
import CosNavbar from "../cosNavbar/CosNavbar";
import NotifiedCos from "../cosNavbar/NotifiedCos";
import { useAddToCart } from "@/context/addToCart/AddToCartContext";
import type { INavbarItem } from "@/types/navbar";

interface IMenuCategory {
  slug: string;
  name: string;
}

interface IMenuProps {
  active?: string;
  setActive?: Dispatch<SetStateAction<boolean>>;
  onHoverHandler?: () => void;
  menu: INavbarItem[];
  categories: IMenuCategory[];
}

export default function Menu({
  active,
  setActive,
  menu,
  onHoverHandler,
  categories,
}: IMenuProps) {
  const { addToCart } = useAddToCart();

  const closeMobileMenuHandler = () => {
    setActive?.((prev) => !prev);
  };

  return (
    <li className={`menu-container ${active}`}>
      <ul>
        {menu.map((item: INavbarItem, key: number) => (
          <li key={key} className={`li-${item.link}`}>
            <Link href={`/${item.link}`}>
              {active ? (
                <>
                  {item.link === "cos" ? <NotifiedCos active={active} /> : null}
                  <span
                    className={item.link}
                    onClick={closeMobileMenuHandler}
                    onMouseEnter={onHoverHandler}
                    onMouseLeave={onHoverHandler}
                  >
                    {item.category}
                  </span>
                </>
              ) : (
                <>
                  {item.link === "cos" ? <NotifiedCos /> : null}
                  <span className={item.link}>{item.category}</span>
                </>
              )}
            </Link>
            {item.modal && item.link === "abonamente" ? (
              <MenuModal className={item.link}>
                <ul>
                  {categories.map((category) => (
                    <li key={category.slug}>
                      <Link
                        href={`/${item.link}/${category.slug}`}
                        onClick={() => setActive?.(false)}
                      >
                        <span>{category.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </MenuModal>
            ) : item.modal && item.link === "cos" && addToCart.length > 0 ? (
              <CosNavbar menu={item} />
            ) : null}
          </li>
        ))}
      </ul>
    </li>
  );
}
