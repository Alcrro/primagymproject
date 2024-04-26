import React from "react";
import "./abonamente.scss";
import Subscriptions from "@/components/abonamente/abonamente/Subscriptions";
import Trainers from "@/components/abonamente/trainers/Trainers";

export default function page() {
  return (
    <>
      <Subscriptions />
      <Trainers slug="" />
    </>
  );
}
