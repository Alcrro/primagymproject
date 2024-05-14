import { subscriptionCategory } from "@/app/_core/subscriptionCategories";

export async function GET() {
  try {
    return Response.json(subscriptionCategory);
  } catch (error) {
    console.log(error);
  }
}
