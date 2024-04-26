import React from "react";

export default function page({ params }: { params: { slug: string } }) {
  return <div>{params.slug}</div>;
}
