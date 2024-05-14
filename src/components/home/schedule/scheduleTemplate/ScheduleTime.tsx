"use client";
import React from "react";

export default function ScheduleTime({ schedule, valid, checkDay }: any) {
  return (
    <>
      {checkDay ? (
        <span className="text-center font-semibold text-red-500">
          <span>ACUM - Inchis</span>
          {/* <span></span> */}
        </span>
      ) : !valid ? (
        <span className="text-center">
          {schedule.oraStart} - {schedule.oraEnd}
        </span>
      ) : (
        <span className="text-center font-semibold text-green-700">
          <span>ACUM - Deschis</span>
        </span>
      )}
    </>
  );
}
