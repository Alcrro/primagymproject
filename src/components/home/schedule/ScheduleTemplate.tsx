import dynamic from "next/dynamic";
import React from "react";
import { IScheduleEntry } from "@/types/schedule";

interface IScheduleTemplateProps {
  schedule: IScheduleEntry;
  checkDay: boolean;
}

export default function ScheduleTemplate({ schedule, checkDay }: IScheduleTemplateProps) {
  const ScheduleTime = dynamic(() => import("./scheduleTemplate/ScheduleTime"));
  const startTime = schedule.oraStart;
  const endTime = schedule.oraEnd;
  const currentDate = new Date();
  const startDate = new Date(currentDate.getTime());

  startDate.setHours(Number(startTime.split(":")[0]));
  startDate.setMinutes(Number(startTime.split(":")[1]));

  const endDate = new Date(currentDate.getTime());
  endDate.setHours(Number(endTime.split(":")[0]));
  endDate.setMinutes(Number(endTime.split(":")[1]));

  const valid = startDate <= currentDate && endDate >= currentDate;

  return (
    <li
      className={`li-schedule${!checkDay && valid ? " active" : " inActive"}`}
      suppressHydrationWarning
    >
      <ScheduleTime schedule={schedule} valid={valid} checkDay={checkDay} />
      <span>-</span>
      <span className="text-center">{schedule.category}</span>
      {schedule.trainer === undefined ? null : (
        <>
          <span>-</span>
          <span className="text-center">{schedule.trainer}</span>
        </>
      )}
    </li>
  );
}
