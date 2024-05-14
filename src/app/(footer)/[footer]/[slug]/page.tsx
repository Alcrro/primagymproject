import React from "react";
export const dynamic = "force-dynamic";
export default function page({ params }: { params: { slug: string } }) {
  return <div>{params.slug}</div>;
}
