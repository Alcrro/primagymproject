"use client";
import { Loader } from "@googlemaps/js-api-loader";
import React, { useEffect, useRef } from "react";

export default function Location() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: "quarterly",
      });
      const { Map } = await loader.importLibrary("maps");
      const position = {
        lat: 47.7991836,
        lng: 22.8738521,
      };
      const mapOptions: google.maps.MapOptions = {
        center: position,
        zoom: 17,
        mapId: "MY_NEXTJS_MAPID",
      };
      const map = new Map(mapRef.current as HTMLDivElement, mapOptions);
    };
    initMap();
  }, []);

  return <div className="h-[600px] max-w-[96rem] m-auto " ref={mapRef}></div>;
}
