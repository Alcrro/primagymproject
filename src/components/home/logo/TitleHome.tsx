"use client";
import Logo from "@/components/navbar/logo/Logo";
import React, { lazy, Suspense } from "react";
import "./logoHome.scss";
import BackgroundVideo from "../backgroundVideo/BackgroundVideo";
import { useContextApi } from "@/context/contextAPI/ContextAPI";

export default function LogoHome() {
  const { titleRef, pathname, logoRef } = useContextApi();

  return pathname?.endsWith("/") ? (
    <div className="thumbnail">
      <Suspense>
        <BackgroundVideo />
      </Suspense>
      <div className="title-home-container">
        <ul>
          <div className="big-logo text-center" ref={logoRef}>
            <Logo />
          </div>
          <li className="description" ref={titleRef}>
            <span className="">
              Facand sport in fiecare zi, corpul iti va multumi!
            </span>
          </li>
        </ul>
      </div>
    </div>
  ) : null;
}
