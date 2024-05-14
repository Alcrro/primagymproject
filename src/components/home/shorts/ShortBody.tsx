"use client";
import { useContextApi } from "@/context/contextAPI/ContextAPI";
import Image from "next/image";
import React from "react";

export default function ShortBody({ shortModal }: { shortModal: string }) {
  const { activeModal, setActiveModal } = useContextApi();
  console.log(activeModal);
  return (
    <div className="short" onClick={() => setActiveModal((prev: any) => !prev)}>
      <div className={`short-timer ${shortModal}`}></div>
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
