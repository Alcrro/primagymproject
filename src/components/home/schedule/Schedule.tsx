"use client";
import React from "react";
import "./schedule.scss";
import { schedules } from "@/app/_core/schedule";
import ScheduleTemplate from "./ScheduleTemplate";
export default function Schedule() {
  const today = new Date();

  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const d = new Date();
  let day = weekday[d.getDay()];

  return (
    <div className="schedule-container">
      <div className="title">Orar</div>
      <div className="schedule-inner">
        {schedules.map((schedule, key) => (
          <div key={key} suppressHydrationWarning className="p-4">
            <div className="day-schedule">{schedule.data}</div>
            <ul className="ul-schedule flex flex-col gap-2 my-4">
              {schedule.values.map((values) => (
                <ScheduleTemplate schedule={values} key={values.id} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
