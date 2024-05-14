import { schedules } from "@/app/_core/schedule";

export async function GET() {
  try {
    return Response.json(schedules);
  } catch (error) {
    console.log(error);
  }
}
