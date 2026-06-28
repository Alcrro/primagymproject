"use client";
import React from "react";
import Logo from "./logo/Logo";
import Menu from "./menu/Menu";
import NavbarAuth from "./navbarAuth/NavbarAuth";
import ThemeSwitch from "@/app/ThemeSwitch";
import { useContextApi } from "@/context/contextAPI/ContextAPI";
import type { IAuthUser } from "@/types/auth";
import type { INavbarItem } from "@/types/navbar";

interface INavbarCategory {
  slug: string;
  name: string;
}

interface INavbarModalProps {
  menu: INavbarItem[];
  user: IAuthUser | null;
  categories: INavbarCategory[];
}

export default function NavbarModal({ menu, user, categories }: INavbarModalProps) {
  const { onHoverHandler, active, setActive } = useContextApi();

  const toggleMobileMenu = () => {
    setActive((prev: boolean) => !prev);
  };

  return (
    <>
      <ul className="ul-navbar">
        <Logo />
        <Menu active="" menu={menu} categories={categories} />
        <NavbarAuth user={user} />
        <li className="theme-switch-item">
          <ThemeSwitch />
        </li>
        <li
          className="collapse-navbar-menu"
          onClick={toggleMobileMenu}
          aria-label={active ? "Închide meniu" : "Deschide meniu"}
        >
          {active ? (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </li>
      </ul>
      <Menu
        active={active ? "mobile active" : "mobile inActive"}
        setActive={setActive}
        menu={menu}
        onHoverHandler={onHoverHandler}
        categories={categories}
      />
    </>
  );
}
