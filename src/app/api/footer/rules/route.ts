import { rules } from "@/app/_core/rules";

export async function GET() {
  try {
    return Response.json(rules);
  } catch (error) {
    console.log(error);
  }
}
