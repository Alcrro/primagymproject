import "./gallery.scss";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { getGallery } from "@/app/_lib/gallery/getGallery";

export default async function GalleryPhotos() {
  const photos = await getGallery();

  return (
    <div className="gallery-inner">
      <ul className="ul-gallery">
        {photos.map((photo) => (
          <li key={photo.id} className="li-gallery">
            <Link href={`/galerie/${photo.id}`}>
              <Image
                src={photo.url}
                alt={photo.altText ?? photo.filename}
                width={1000}
                height={1000}
                className="image-gallery"
                priority
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
