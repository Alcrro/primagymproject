"use client";

import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import "./locationDetail.scss";

interface ILocationMapProps {
  lat: number;
  lng: number;
  name: string;
}

function GoogleMap({ lat, lng, name }: ILocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY!,
      version: "weekly",
    });

    loader.importLibrary("maps").then(async ({ Map }) => {
      const { AdvancedMarkerElement } = await loader.importLibrary("marker") as google.maps.MarkerLibrary;
      const map = new Map(mapRef.current!, {
        center: { lat, lng },
        zoom: 17,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });
      new AdvancedMarkerElement({ map, position: { lat, lng }, title: name });
    });
  }, [lat, lng, name]);

  return <div ref={mapRef} className="ldet-map" />;
}

function OSMMap({ lat, lng, name }: ILocationMapProps) {
  const delta = 0.005;
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&marker=${lat},${lng}&layer=mapnik`;

  return (
    <iframe
      src={src}
      className="ldet-map"
      title={`Hartă ${name}`}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}

export default function LocationMap(props: ILocationMapProps) {
  if (!process.env.NEXT_PUBLIC_MAPS_API_KEY) {
    return <OSMMap {...props} />;
  }
  return <GoogleMap {...props} />;
}
