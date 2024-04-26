"use client";
import "./gallery.scss";
import Link from "next/link";
import Image from "next/image";
import gallery, { WonderImage } from "@/app/_core/gallery";
import React from "react";

export default function GalleryPhotos() {
  return (
    <div className="gallery-inner">
      <ul className="ul-gallery">
        {gallery.map((photo) => (
          <li key={photo.id} className="li-gallery">
            <Link href={`/galerie/${photo.id}`}>
              <Image src={photo.src} alt="image" width={1000} height={1000} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
