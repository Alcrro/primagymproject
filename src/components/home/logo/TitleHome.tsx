"use client";
import Logo from "@/components/navbar/logo/Logo";
import React, { lazy, Suspense } from "react";
import "./logoHome.scss";

import { useContextApi } from "@/context/contextAPI/ContextAPI";

export default function LogoHome() {
  const { titleRef, pathname } = useContextApi();
  const BackgroundVideo = lazy(
    () => import("../backgroundVideo/BackgroundVideo")
  );
  return pathname.endsWith("/") ? (
    <div className="thumbnail">
      <Suspense>
        <BackgroundVideo />
      </Suspense>
      <div className="title-home-container">
        <ul>
          <Logo description="big-logo" />
          <li className="description" ref={titleRef}>
            <span className="">
              Having good habits every day, it means a lot.
            </span>
          </li>
        </ul>
      </div>
    </div>
  ) : null;
}
