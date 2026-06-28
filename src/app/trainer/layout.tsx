import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function TrainerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "TRAINER" && session.user.role !== "ADMIN") redirect("/");
  return <>{children}</>;
}
