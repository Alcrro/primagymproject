import "./gallery.scss";
import Link from "next/link";
import Image from "next/image";
import React, { lazy } from "react";
import { getGallery } from "@/app/_lib/gallery/getGallery";

export default async function GalleryPhotos() {
  const gallery = await getGallery();

  const GetGalley = lazy(() => import("./getGallery"));
  return (
    <div className="gallery-inner">
      <ul className="ul-gallery">
        <GetGalley gallery={gallery} />
      </ul>
    </div>
  );
}
