"use client";
import React from "react";
import { IScheduleEntry } from "@/types/schedule";

interface IScheduleTimeProps {
  schedule: IScheduleEntry;
  valid: boolean;
  checkDay: boolean;
}

export default function ScheduleTime({ schedule, valid, checkDay }: IScheduleTimeProps) {
  return (
    <>
      {checkDay ? (
        <span className="text-center font-semibold text-red-500">
          <span>ACUM - Inchis</span>
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
