import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function GetGallery({ gallery }: { gallery: [] }) {
  return (
    <>
      {gallery.map((photo: any) => (
        <li key={photo.id} className="li-gallery">
          <Link href={`/galerie/${photo.id}`}>
            <Image
              src={`/gallery/${photo.name}`}
              alt="image"
              width={1000}
              height={1000}
              className="image-gallery"
              priority
            />
          </Link>
        </li>
      ))}
    </>
  );
}
