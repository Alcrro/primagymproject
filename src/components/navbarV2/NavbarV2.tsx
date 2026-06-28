import { Suspense } from "react";
import NavbarV2Client from "./NavbarV2Client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import type { IAuthUser } from "@/types/auth";

export default async function NavbarV2() {
  const [session, categories, locations] = await Promise.all([
    auth(),
    prisma.subscriptionCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { slug: true, name: true },
    }),
    prisma.location.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { slug: true, name: true },
    }),
  ]);

  const user: IAuthUser | null = session?.user
    ? {
        id: session.user.id,
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
        role: session.user.role,
      }
    : null;

  return (
    <nav className="navbar-v2-container">
      <Suspense fallback={null}>
        <NavbarV2Client user={user} categories={categories} locations={locations} />
      </Suspense>
    </nav>
  );
}
