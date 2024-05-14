import dynamic from "next/dynamic";
import React from "react";

interface ISchedule {
  schedule?: any;
  checkDay?: any;
}

export default function ScheduleTemplate({ schedule, checkDay }: ISchedule) {
  const ScheduleTime = dynamic(() => import("./scheduleTemplate/ScheduleTime"));
  let startTime: any = schedule.oraStart;
  let endTime: any = schedule.oraEnd;
  const currentDate = new Date();
  let startDate = new Date(currentDate.getTime());

  startDate.setHours(startTime.split(":")[0]);
  startDate.setMinutes(startTime.split(":")[1]);

  let endDate = new Date(currentDate.getTime());
  endDate.setHours(endTime.split(":")[0]);
  endDate.setMinutes(endTime.split(":")[1]);

  let valid = startDate <= currentDate && endDate >= currentDate;

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
