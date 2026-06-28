export interface IScheduleEntry {
  id: number;
  category: string;
  oraStart: string;
  oraEnd: string;
  trainer?: string;
}

export interface IScheduleGroup {
  category: string;
  weekday?: string;
  values: IScheduleEntry[];
}
