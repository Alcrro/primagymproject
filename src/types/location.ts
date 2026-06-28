export interface IScheduleDay {
  days: string;
  open: string | null;
  close: string | null;
}

export interface ILocation {
  id: number;
  slug: string;
  name: string;
  city: string | null;
  county: string | null;
  postalCode: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  lat: number | null;
  lng: number | null;
  photo: string | null;
  amenities: string[];
  schedule: IScheduleDay[] | null;
  isActive: boolean;
  sortOrder: number;
}
