import React from "react";
import "./trainers.scss";
import { trainers } from "@/app/_core/antrenori";

import TrainersModal from "./TrainersModal";
export default function Trainers({ slug }: { slug: string }) {
  return <TrainersModal trainers={trainers} slug={slug} />;
}
