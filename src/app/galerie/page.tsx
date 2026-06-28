import React from "react";
import type { Metadata } from "next";
import GalleryPhotos from "@/components/gallery/GalleryPhotos";

export const metadata: Metadata = {
  title: 'Galerie Foto',
  description:
    'Galerie foto ApexFit Bacău — sală de fitness, clase de zumba, aerobic și cycling. Vezi cum arată sala, echipamentele și atmosfera.',
};

export default function page() {
  return (
    <div className="gallery-container">
      <GalleryPhotos />
    </div>
  );
}
