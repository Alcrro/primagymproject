import { information } from "@/app/_core/information";

export async function GET() {
  try {
    return Response.json(information);
  } catch (error) {
    console.log(error);
  }
}
