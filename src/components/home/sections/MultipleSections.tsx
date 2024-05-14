import React, { Suspense } from "react";
import Schedule from "../schedule/Schedule";
import AboutUs from "../about/AboutUs";
import Shorts from "../shorts/Shorts";
import ShortModal from "../shorts/ShortModal";

export default function MultipleSections() {
  return (
    <>
      <Suspense>
        <Schedule />
      </Suspense>
      <Shorts />
      <ShortModal />
      <Suspense>
        <AboutUs />
      </Suspense>
    </>
  );
}
