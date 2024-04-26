"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import abonamentZumba from "../../../../public/cardsImages/zumbaCard.jpg";

import cycling from "../../../../public/cardsImages/cycling3.jpg";
import aerobic from "../../../../public/cardsImages/aerobic.jpg";
import fitness from "../../../../public/cardsImages/fitness2.jpg";

export default function Subscriptions() {
  return (
    <div className="abonamente-container">
      <div className="abonamente-inner">
        <div className="zumba-container">
          <Link href="/abonamente/zumba" className="relative">
            <Image src={abonamentZumba} alt="zumba" className="image " />
            <span className="description text-white">ZUMBA</span>
          </Link>
        </div>
        <div className="cycling-container">
          <Link href="/abonamente/cycling" className="relative">
            <Image src={cycling} alt="cycling" className="image" />
            <span className="description text-white">CYCLING</span>
          </Link>
        </div>
        <div className="aerobic-container">
          <Link href="/abonamente/aerobic" className="relative">
            <Image src={aerobic} alt="aerobic" className="image" />
            <span className="description text-white">AEROBIC</span>
          </Link>
        </div>
        <div className="fitness">
          <Link href="/abonamente/fitness" className="relative">
            <Image src={fitness} alt="fitness" className="image" />
            <span className="description text-white">FITNESS</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
