"use client";
import React from "react";
import TrainersModal from "../trainers/TrainersModal";
import { IAntrenorProfile, trainers } from "@/app/_core/antrenori";

export default function SubscriptionTrainers({trainers, slug }: {trainers: IAntrenorProfile[], slug: string }) {
  return <TrainersModal trainers={trainers} slug={slug} />;
}
