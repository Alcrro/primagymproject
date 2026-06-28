import { schedules } from "@/app/_core/schedule";
import { IScheduleGroup } from "@/types/schedule";

export default function getSchedule(): IScheduleGroup[] {
  return schedules;
}
