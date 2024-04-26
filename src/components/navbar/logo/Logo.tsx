"use client";
import Image from "next/image";
import React from "react";
import logoImage from "../../../../public/cardsImages/primaGymBacgroundCards-removebg-preview.png";
import "./logo.scss";
import Link from "next/link";

export default function Logo() {
  return (
    <li className="logo-container">
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
