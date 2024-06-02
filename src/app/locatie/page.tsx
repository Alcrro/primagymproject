import { Metadata } from "next";
import Location from "../../components/locatie/Location";
import React from "react";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "PrimaGym - Locatie",
};

export default function page() {
  return <Location />;
}
