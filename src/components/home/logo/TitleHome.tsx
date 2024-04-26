"use client";
import Logo from "@/components/navbar/logo/Logo";
import React from "react";
import { usePathname } from "next/navigation";
import "./logoHome.scss";
import BackgroundVideo from "../backgroundVideo/BackgroundVideo";
export default function LogoHome() {
  const pathname = usePathname();

  return pathname.endsWith("/") ? (
    <div className="thumbnail">
      <BackgroundVideo />
      <div className="title-home-container">
        <ul>
          <Logo />
          <div className="description">
            <span className="">
              Having good habits every day, it means a lot.
            </span>
          </div>
        </ul>
      </div>
    </div>
  ) : null;
}
