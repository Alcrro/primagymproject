import React from "react";

const page = ({ params: { id } }: { params: { id: number } }) => {
  return <div className="">{id}</div>;
};

export default page;
