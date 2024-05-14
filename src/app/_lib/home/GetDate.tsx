import React from "react";

export default function GetDate(schedule: any, checkDay: any) {
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

  return valid;
}
