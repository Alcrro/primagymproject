import { auth } from "@/auth";
import PwaBottomNavClient from "./PwaBottomNavClient";
import type { UserRole } from "@/types/auth";

export default async function PwaBottomNav() {
  const session = await auth();
  const role: UserRole | null = (session?.user?.role as UserRole) ?? null;
  return <PwaBottomNavClient role={role} />;
}
