import React from "react";
import GalleryPhotos from "../../components/gallery/GalleryPhotos";
export const dynamic = "force-dynamic";
export default function page() {
  return (
    <div className="gallery-container">
      <GalleryPhotos />
    </div>
  );
}
