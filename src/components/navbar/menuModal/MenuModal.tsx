import React from "react";
import "./menuModal.scss";

export default function MenuModal({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return <div className={`modal-container modal-${className}`}>{children}</div>;
}
