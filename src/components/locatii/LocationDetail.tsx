import Image from "next/image";
import Link from "next/link";
import { ILocation } from "@/types/location";
import { ITrainer } from "@/types/trainer";
import LocationMap from "./LocationMap";
import "./locationDetail.scss";

interface ILocationDetailProps {
  location: ILocation;
  trainers: ITrainer[];
}

type TravelMode = "driving" | "transit" | "walking";

function mapsNavUrl(location: ILocation, mode?: TravelMode) {
  const base = "https://www.google.com/maps/dir/?api=1";
  const dest =
    location.lat && location.lng
      ? `${location.lat},${location.lng}`
      : encodeURIComponent(
          [location.address, location.city, location.county].filter(Boolean).join(", ")
        );
  return `${base}&destination=${dest}${mode ? `&travelmode=${mode}` : ""}`;
}

const TRANSPORT_OPTIONS: { mode: TravelMode; icon: string; label: string }[] = [
  { mode: "driving",  icon: "🚗", label: "Cu mașina" },
  { mode: "transit",  icon: "🚌", label: "Transport în comun" },
  { mode: "walking",  icon: "🚶", label: "Pe jos" },
];

export default function LocationDetail({ location, trainers }: ILocationDetailProps) {
  const schedule = location.schedule ?? [];
  const hasContact = !!(location.phone || location.email);
  const hasNavigation = !!(location.lat || location.lng || location.address);

  const parkingAmenities = location.amenities.filter((a) =>
    /parcar|parking|loc de parcare/i.test(a)
  );

  return (
    <article className="ldet-container">
      {/* Hero */}
      <div className="ldet-hero">
        {location.photo ? (
          <Image
            src={`/locations/${location.photo}`}
            alt={location.name}
            fill
            priority
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="ldet-hero-placeholder">
            <svg viewBox="0 0 80 80" fill="none" aria-hidden="true">
              <circle cx="40" cy="32" r="14" stroke="rgba(255,255,255,0.5)" strokeWidth="3" />
              <path d="M40 46C27 46 17 52 17 60h46c0-8-10-14-23-14Z" fill="rgba(255,255,255,0.2)" />
            </svg>
          </div>
        )}
        <div className="ldet-hero-overlay">
          <h1 className="ldet-hero-title">{location.name}</h1>
          {location.city && <p className="ldet-hero-city">{location.city}</p>}
        </div>
      </div>

      <div className="ldet-body">
        <div className="ldet-main">
          {/* Adresă */}
          <section className="ldet-section">
            <h2 className="ldet-section-title">Adresă</h2>
            <p className="ldet-address-line">
              {[location.address, location.city, location.county, location.postalCode]
                .filter(Boolean)
                .join(", ")}
            </p>
            <a
              href={mapsNavUrl(location)}
              target="_blank"
              rel="noopener noreferrer"
              className="ldet-maps-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              Deschide în Maps
            </a>
          </section>

          {/* Cum ajungi */}
          {hasNavigation && (
            <section className="ldet-section">
              <h2 className="ldet-section-title">Cum ajungi</h2>
              <div className="ldet-transport-grid">
                {TRANSPORT_OPTIONS.map(({ mode, icon, label }) => (
                  <a
                    key={mode}
                    href={mapsNavUrl(location, mode)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ldet-transport-btn"
                  >
                    <span className="ldet-transport-icon">{icon}</span>
                    <span>{label}</span>
                  </a>
                ))}
              </div>
              {parkingAmenities.length > 0 && (
                <p className="ldet-parking-note">
                  🅿️ {parkingAmenities.join(" · ")}
                </p>
              )}
            </section>
          )}

          {/* Program */}
          {schedule.length > 0 && (
            <section className="ldet-section">
              <h2 className="ldet-section-title">Program</h2>
              <ul className="ldet-schedule">
                {schedule.map((row, i) => (
                  <li key={i} className="ldet-schedule-row">
                    <span className="ldet-schedule-days">{row.days}</span>
                    <span className="ldet-schedule-hours">
                      {row.open && row.close ? `${row.open} – ${row.close}` : "Închis"}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Facilități */}
          {location.amenities.length > 0 && (
            <section className="ldet-section">
              <h2 className="ldet-section-title">Facilități</h2>
              <ul className="ldet-amenities">
                {location.amenities.map((a) => (
                  <li key={a} className="ldet-amenity">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {a}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Contact */}
          {hasContact && (
            <section className="ldet-section">
              <h2 className="ldet-section-title">Contact</h2>
              <div className="ldet-cta-wrap">
                {location.phone && (
                  <a href={`tel:${location.phone.replace(/\s/g, "")}`} className="ldet-cta-btn ldet-cta-btn--primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.09 6.09l1.27-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    Sună acum
                  </a>
                )}
                {location.email && (
                  <a href={`mailto:${location.email}`} className="ldet-cta-btn ldet-cta-btn--secondary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    Trimite email
                  </a>
                )}
                <Link href="/abonamente" className="ldet-cta-btn ldet-cta-btn--outline">
                  Vezi abonamente →
                </Link>
              </div>
            </section>
          )}
        </div>

        {/* Hartă */}
        <div className="ldet-aside">
          {location.lat && location.lng ? (
            <LocationMap lat={location.lat} lng={location.lng} name={location.name} />
          ) : (
            <div className="ldet-map-fallback">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              <p>Coordonate indisponibile</p>
              <a href={mapsNavUrl(location)} target="_blank" rel="noopener noreferrer" className="ldet-maps-btn">
                Caută în Maps →
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Antrenori */}
      {trainers.length > 0 && (
        <section className="ldet-section ldet-trainers-section">
          <h2 className="ldet-section-title">Antrenorii noștri</h2>
          <div className="ldet-trainers-grid">
            {trainers.map((t) => (
              <Link
                key={t.id}
                href={`/antrenori/${location.slug}/${t.id}`}
                className="ldet-trainer-card"
              >
                <span className="ldet-trainer-name">{t.name}</span>
                <span className="ldet-trainer-cat">{t.category}</span>
              </Link>
            ))}
          </div>
          <Link href={`/antrenori/${location.slug}`} className="ldet-all-trainers">
            Vezi toți antrenorii →
          </Link>
        </section>
      )}
    </article>
  );
}
