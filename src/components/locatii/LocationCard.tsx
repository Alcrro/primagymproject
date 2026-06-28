import Image from "next/image";
import Link from "next/link";
import { ILocation } from "@/types/location";

interface ILocationCardProps {
  location: ILocation & { _count: { trainers: number } };
}

export default function LocationCard({ location }: ILocationCardProps) {
  return (
    <div className="lc-card">
      <div className="lc-photo">
        {location.photo ? (
          <Image
            src={`/locations/${location.photo}`}
            alt={location.name}
            fill
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="lc-photo-placeholder">
            <span className="lc-photo-initial">
              {location.city?.charAt(0).toUpperCase() ?? location.name.charAt(0).toUpperCase()}
            </span>
            <span className="lc-photo-label">{location.city ?? location.name}</span>
          </div>
        )}
      </div>

      <div className="lc-body">
        <h2 className="lc-name">{location.name}</h2>
        {location.city && <p className="lc-city">{location.city}</p>}
        {location.address && <p className="lc-address">{location.address}</p>}
        {location._count.trainers > 0 && (
          <p className="lc-trainers">{location._count.trainers} antrenori activi</p>
        )}
        <Link href={`/locatii/${location.slug}`} className="lc-btn">
          Vezi locația →
        </Link>
      </div>
    </div>
  );
}
