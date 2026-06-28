export type SessionStatus = "SCHEDULED" | "CANCELLED" | "COMPLETED";
export type BookingStatus = "CONFIRMED" | "CANCELLED";
export type RequestStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";

export interface IClassSession {
  id: number;
  trainerId: number;
  locationId: number | null;
  categorySlug: string;
  startAt: Date;
  durationMinutes: number;
  maxCapacity: number;
  status: SessionStatus;
  notes: string | null;
  createdAt: Date;
}

export interface IClassSessionWithDetails extends IClassSession {
  trainer: { id: number; name: string; thumbnail: string | null };
  location: { id: number; slug: string; name: string } | null;
  _count: { bookings: number };
}

export interface IClassBooking {
  id: number;
  sessionId: number;
  userId: string;
  status: BookingStatus;
  createdAt: Date;
}

export interface IPersonalRequest {
  id: number;
  memberId: string;
  trainerId: number;
  requestedAt: Date;
  message: string | null;
  status: RequestStatus;
  responseNote: string | null;
  createdAt: Date;
}

export interface IPersonalRequestWithDetails extends IPersonalRequest {
  member: { id: string; name: string | null; email: string | null; image: string | null };
  trainer: { id: number; name: string };
}
