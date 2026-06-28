import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import LocationDetail from "@/components/locatii/LocationDetail";
import LocationStructuredData from "@/components/locatii/LocationStructuredData";
import { ILocation, IScheduleDay } from "@/types/location";
import { ITrainer } from "@/types/trainer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://apexfit.ro";

export async function generateStaticParams() {
  const locations = await prisma.location.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return locations.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const loc = await prisma.location.findUnique({ where: { slug } });
  if (!loc) return {};

  const city = loc.city ?? loc.name;
  const description = [
    `Vizitează PrimaGYM în ${city}`,
    loc.address ? `${loc.address}` : null,
    loc.phone ? `Sună la ${loc.phone}` : null,
  ].filter(Boolean).join(". ") + ".";

  return {
    title: `PrimaGYM ${city} — Sală de fitness și aerobic`,
    description,
    openGraph: {
      title: `PrimaGYM ${city}`,
      description,
      url: `${SITE_URL}/locatii/${slug}`,
      ...(loc.photo && { images: [{ url: `${SITE_URL}/locations/${loc.photo}` }] }),
    },
  };
}

export default async function LocatieDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const location = await prisma.location.findUnique({
    where: { slug, isActive: true },
    include: {
      trainers: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!location) notFound();

  const { trainers, ...locationData } = location;

  return (
    <>
      <LocationStructuredData
        location={{ ...locationData, schedule: locationData.schedule as IScheduleDay[] | null }}
        siteUrl={SITE_URL}
      />
      <LocationDetail
        location={{ ...locationData, schedule: locationData.schedule as IScheduleDay[] | null } as ILocation}
        trainers={trainers as ITrainer[]}
      />
    </>
  );
}
