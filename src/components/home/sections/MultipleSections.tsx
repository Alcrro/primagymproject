import React from "react";
import ScheduleV2 from "../schedule/ScheduleV2";
import AboutV2 from "../about/AboutV2";
import ShortsV2 from "../shorts/ShortsV2";
import Benefits from "../benefits/Benefits";
import Testimoniale from "../testimoniale/Testimoniale";

export default function MultipleSections() {
  return (
    <>
      <ScheduleV2 />
      <Benefits />
      <ShortsV2 />
      <Testimoniale />
      <AboutV2 />
    </>
  );
}
