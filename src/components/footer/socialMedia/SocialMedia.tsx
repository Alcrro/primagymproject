"use client";
import React from "react";
import "./socialMedia.scss";
import Link from "next/link";

export default function SocialMedia() {
  return (
    <div className="footer-social-media-container">
      <div className="title">Social Media:</div>
      <Link href={"https://www.facebook.com/primagym.sm"}>
        <span className="facebook"></span>
      </Link>
    </div>
  );
}
