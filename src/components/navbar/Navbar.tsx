"use client";
import React, { useState } from "react";
import "./navbar.scss";
import Logo from "./logo/Logo";
import Menu from "./menu/Menu";

import Button from "../button/Button";

export default function Navbar() {
  const [active, setActive] = useState(false);
  const collapseHandle = () => {
    setActive((prev) => !prev);
  };
  return (
    <nav className="nav navbar-container">
      <ul className="ul-navbar">
        <Logo />
        <Menu active="" />
        <Button
          className={`collapse-navbar-menu${!active ? " inActive" : " active"}`}
          setActive={setActive}
          active={active}
          handleClick={collapseHandle}
        />
      </ul>
      {/* <Header /> */}
      <Menu active={active ? "active" : "inActive"} setActive={setActive} />
    </nav>
  );
}
