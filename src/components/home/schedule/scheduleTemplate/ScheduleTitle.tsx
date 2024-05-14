import React from "react";
export default function ScheduleTitle() {
  const today = new Date();
  return (
    <div className="day-schedule">
      Azi -
      <span suppressHydrationWarning className="break-words">
        {today.toLocaleDateString()}
      </span>
    </div>
  );
}
