"use client";
import Image from "next/image";
import React from "react";
import logoImage from "../../../../public/cardsImages/primaGymBacgroundCards-removebg-preview.png";
import "./logo.scss";
import Link from "next/link";
import { useContextApi } from "@/context/contextAPI/ContextAPI";

export default function Logo({ description }: { description?: string }) {
  const { logoRef } = useContextApi();

  return (
    <li className={`logo-container bigger ${description}`} ref={logoRef}>
      <Link href="/">
        <Image
          src={logoImage}
          alt="logo"
          width={500}
          height={500}
          className="logo-image"
        ></Image>
      </Link>
    </li>
  );
}
