"use client";
import React from "react";
import "./logo.scss";
import Link from "next/link";
import { useContextApi } from "@/context/contextAPI/ContextAPI";
import ApexFitLogo from "./ApexFitLogo";

export default function Logo({ description }: { description?: string }) {
  const { logoRef } = useContextApi();

  return (
    <li className={`logo-container bigger ${description}`} ref={logoRef}>
      <Link href="/">
        <ApexFitLogo className="logo-image" width={500} height={200} />
      </Link>
    </li>
  );
}
