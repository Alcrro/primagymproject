"use client";
import React, { useState } from "react";
import Logo from "./logo/Logo";
import Menu from "./menu/Menu";
import Button from "../button/Button";
import { useContextApi } from "../../context/contextAPI/ContextAPI";
import { usePathname } from "next/navigation";

export default function NavbarModal({ menu }: any) {
  const { onHoverActive, onHoverHandler, active, setActive } = useContextApi();
  const pathname = usePathname();
  const collapseHandle = (setActive: any) => {
    setActive((prev: any) => !prev);
  };

  return (
    <>
      <ul className={`ul-navbar ${pathname === "/" ? "home" : "notHome"}`}>
        <Logo />
        <Menu active="" menu={menu} />
        <li
          className={`collapse-navbar-menu${!active ? " inActive" : " active"}`}
          onClick={() => collapseHandle(setActive)}
        >
          <Button className={`${!active ? " inActive" : " active"}`} />
        </li>
      </ul>
      {/* <Header /> */}
      <Menu
        active={active ? "mobile active" : "mobile inActive"}
        setActive={setActive}
        menu={menu}
        onHoverHandler={onHoverHandler}
        onHoverActive={onHoverActive}
      />
    </>
  );
}
