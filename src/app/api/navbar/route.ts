import { menuNavbar } from "@/app/_core/navbarMenu";

export async function GET() {
  try {
    return Response.json(menuNavbar);
  } catch (error) {
    console.log(error);
  }
}
