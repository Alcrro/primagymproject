"use client";
import Image from "next/image";
import React from "react";
import "./aboutModal.scss";
export default function AboutModel({
  photo,
  title,
  description,
}: {
  photo: string;
  title: string;
  description: string;
}) {
  return (
    <div className="about-inner">
      <div className="header">
        <Image
          src={`/cardsImages/primaGymLogoOriginal-removebg-preview.png`}
          alt=""
          width={400}
          height={400}
        ></Image>
      </div>
      <div className="body">
        <div className="title">{title}</div>
        <div className="body-description">{description}</div>
      </div>
    </div>
  );
}
