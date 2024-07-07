import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Gym - Galerie",
};

const layout = (props: {
  modal: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div className="gallery-layout">
      {props.children}
      {props.modal}
    </div>
  );
};

export default layout;
