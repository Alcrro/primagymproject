"use client";
import { useContextApi } from "@/context/contextAPI/ContextAPI";
import Image from "next/image";
import React from "react";

export default function ShortBody() {
  const { shortActive, setShortActive } = useContextApi();

  return (
    <div className="short" onClick={() => setShortActive((prev) => !prev)}>
      <div className="short-image">
        <Image
          src={"/cardsImages/cycling2.jpg"}
          alt=""
          width={300}
          height={500}
        ></Image>
      </div>
    </div>
  );
}
