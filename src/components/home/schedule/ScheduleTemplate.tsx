"use client";
import React from "react";

export default function ScheduleTemplate({ schedule }: { schedule: any }) {
  let startTime: any = schedule.oraStart;
  let endTime: any = schedule.oraEnd;

  // console.log(schedule.oraStart);

  const currentDate = new Date(); 

  

  let startDate = new Date(currentDate.getTime());

  startDate.setHours(startTime.split(":")[0]);
  startDate.setMinutes(startTime.split(":")[1]);
  // startDate.setSeconds(startTime.split(":")[2]);

  let endDate = new Date(currentDate.getTime());
  endDate.setHours(endTime.split(":")[0]);
  endDate.setMinutes(endTime.split(":")[1]);
  // endDate.setSeconds(endTime.split(":")[2]);

  let valid = startDate <= currentDate && endDate >= currentDate;

  return (
    <li
      className={`flex gap-2 ${valid ? " active" : "inActive"}`}
      suppressHydrationWarning
    >
      {!valid ? (
        <span className="text-center">
          {schedule.oraStart} - {schedule.oraEnd}
        </span>
      ) : (
        <span className="text-center font-semibold text-green-700">NOW</span>
      )}
      <span>-</span>
      <span className="text-center">{schedule.category}</span>
      <span>-</span>
      <span className="text-center">{schedule.trainer}</span>
    </li>
  );
}
