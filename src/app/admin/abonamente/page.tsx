import { prisma } from "@/lib/prisma";
import AdminAbonamentePage from "@/components/admin/abonamente/AdminAbonamentePage";
import { ICategory } from "@/types/subscription";

export default async function AdminAbonamentePageRoute() {
  const categories = await prisma.subscriptionCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      plans: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  const serialized: ICategory[] = categories.map((cat) => ({
    id: cat.id,
    slug: cat.slug,
    name: cat.name,
    isActive: cat.isActive,
    sortOrder: cat.sortOrder,
    plans: cat.plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      planType: plan.planType as "ENTRIES" | "MONTHLY",
      entries: plan.entries,
      durationMonths: plan.durationMonths,
      withTrainer: plan.withTrainer,
      priceRon: plan.priceRon.toString(),
      discountPct: plan.discountPct.toString(),
      isActive: plan.isActive,
      sortOrder: plan.sortOrder,
    })),
  }));

  return <AdminAbonamentePage categories={serialized} />;
}
