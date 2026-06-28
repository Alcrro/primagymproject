import { ILocation, IScheduleDay } from "@/types/location";

const DAY_MAP: Record<string, string[]> = {
  "luni":      ["Monday"],
  "marti":     ["Tuesday"],
  "miercuri":  ["Wednesday"],
  "joi":       ["Thursday"],
  "vineri":    ["Friday"],
  "sambata":   ["Saturday"],
  "duminica":  ["Sunday"],
  "luni–vineri": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  "luni-vineri": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
};

function scheduleToOpeningHours(schedule: IScheduleDay[]) {
  return schedule
    .filter((s) => s.open && s.close)
    .map((s) => {
      const key = s.days.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
      const days = DAY_MAP[key] ?? [];
      return {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: days,
        opens: s.open,
        closes: s.close,
      };
    })
    .filter((s) => s.dayOfWeek.length > 0);
}

interface IProps {
  location: ILocation;
  siteUrl: string;
}

export default function LocationStructuredData({ location, siteUrl }: IProps) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HealthClub",
    name: `PrimaGYM ${location.city ?? location.name}`,
    url: `${siteUrl}/locatii/${location.slug}`,
    ...(location.phone && { telephone: location.phone }),
    ...(location.email && { email: location.email }),
    ...(location.photo && { image: `${siteUrl}/locations/${location.photo}` }),
    address: {
      "@type": "PostalAddress",
      ...(location.address && { streetAddress: location.address }),
      ...(location.city && { addressLocality: location.city }),
      ...(location.county && { addressRegion: location.county }),
      ...(location.postalCode && { postalCode: location.postalCode }),
      addressCountry: "RO",
    },
    ...(location.lat && location.lng && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: location.lat,
        longitude: location.lng,
      },
    }),
    ...(location.schedule && {
      openingHoursSpecification: scheduleToOpeningHours(location.schedule),
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
