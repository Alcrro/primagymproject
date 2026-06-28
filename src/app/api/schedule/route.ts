import { schedules } from "@/app/_core/schedule";

export async function GET() {
  try {
    return Response.json(schedules);
  } catch {
    return Response.json({ error: "Failed to load schedule" }, { status: 500 });
  }
}
