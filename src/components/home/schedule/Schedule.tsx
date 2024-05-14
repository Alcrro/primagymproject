import React from "react";
import "./schedule.scss";

import ScheduleTemplate from "./ScheduleTemplate";
import ScheduleTitle from "./scheduleTemplate/ScheduleTitle";
import getSchedule from "../../../app/_lib/home/getSchedule";

export default async function Schedule() {
  const schedules = await getSchedule();
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

  const weekend = ["Saturday", "Sunday"];

  const d = new Date();
  let day = weekday[d.getDay()];
  const checkDay = weekend.some((some) => some.includes(day));

  return (
    <div className={`schedule-container`}>
      <div className="schedule-container-inner">
        {schedules.map((schedule: any, key: any) =>
          schedule.category === "group" ? (
            <div key={key} className="schedule-group">
              <div className="title">Orar grupe</div>
              <div className="schedule-inner">
                <div
                  key={key}
                  className={`schedule p-4${
                    !checkDay ? " open" : " closed text-red-500"
                  }`}
                >
                  <ScheduleTitle />
                  <ul className="ul-schedule flex flex-col gap-2 my-4">
                    {schedule.values.map((values: any) => (
                      <ScheduleTemplate
                        schedule={values}
                        key={values.id}
                        checkDay={checkDay}
                      />
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : schedule.category === "fitness" &&
            schedule.weekday !== "Saturday" ? (
            <div key={key} className="schedule-fitness">
              <div className="title">Orar fitness</div>
              <div className="schedule-inner">
                <div
                  key={key}
                  className={`schedule p-4${
                    !checkDay ? " open" : " closed text-red-500"
                  }`}
                >
                  <ScheduleTitle />
                  <ul className="ul-schedule flex flex-col gap-2 my-4">
                    {schedule.values.map((values: any) => (
                      <ScheduleTemplate
                        schedule={values}
                        key={values.id}
                        checkDay={checkDay}
                      />
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
