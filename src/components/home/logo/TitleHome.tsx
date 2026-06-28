"use client";
import Logo from "@/components/navbar/logo/Logo";
import Link from "next/link";
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
            <span>Fii activ. Fii sănătos. Fii ApexFit.</span>
          </li>
          <li className="hero-cta">
            <Link href="/abonamente" className="hero-cta-btn">
              Alege abonamentul tău →
            </Link>
          </li>
        </ul>
      </div>
    </div>
  ) : null;
}
