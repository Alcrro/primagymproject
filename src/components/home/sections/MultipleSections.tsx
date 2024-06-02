import React, { Suspense } from "react";
import Schedule from "../schedule/Schedule";
import AboutUs from "../about/AboutUs";
import Shorts from "../shorts/Shorts";

export default function MultipleSections() {
  return (
    <>
      <Schedule />
      <Shorts />
      <AboutUs />
    </>
  );
}
