import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import "./photoPage.scss";

interface IPageProps { params: { id: string } }

export default async function GaleriePhotoPage({ params }: IPageProps) {
  const photo = await prisma.galleryPhoto.findUnique({
    where: { id: parseInt(params.id, 10) },
  });

  if (!photo) notFound();

  return (
    <div className="gp-container">
      <Link href="/galerie" className="gp-back">← Înapoi la galerie</Link>
      <div className="gp-wrap">
        <Image
          src={photo.url}
          alt={photo.altText ?? photo.filename}
          width={1200}
          height={800}
          className="gp-img"
          priority
        />
      </div>
    </div>
  );
}
