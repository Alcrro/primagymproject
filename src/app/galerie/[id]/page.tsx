import React from "react";
export const dynamic = 'force-dynamic';
const page = ({ params: { id } }: { params: { id: number } }) => {
  return <div className="">{id}</div>;
};

export default page;
