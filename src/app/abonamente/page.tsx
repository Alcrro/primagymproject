import React from "react";
import "./abonamente.scss";
import Subscriptions from "@/components/abonamente/abonamente/Subscriptions";
import Trainers from "@/components/abonamente/trainers/Trainers";

export const dynamic = "force-dynamic";
export default function page() {
  return (
    <>
      <Subscriptions />
      <Trainers slug="" />
    </>
  );
}
