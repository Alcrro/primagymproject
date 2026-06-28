import { prisma } from "@/lib/prisma";
import AdminDiscounturiPage from "@/components/admin/discounturi/AdminDiscounturiPage";
import { IDiscountCode } from "@/types/discount";

export default async function AdminDiscounturiPageRoute() {
  const codes = await prisma.discountCode.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serialized: IDiscountCode[] = codes.map((c) => ({
    id: c.id,
    code: c.code,
    discountPct: c.discountPct !== null ? c.discountPct.toString() : null,
    discountRon: c.discountRon !== null ? c.discountRon.toString() : null,
    validFrom: c.validFrom,
    validUntil: c.validUntil,
    maxUses: c.maxUses,
    currentUses: c.currentUses,
    isActive: c.isActive,
    createdAt: c.createdAt,
  }));

  return <AdminDiscounturiPage codes={serialized} />;
}
