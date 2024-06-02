"use client";
import React, { useEffect, useRef } from "react";
import "./menuModal.scss";
import { useContextApi } from "../../../context/contextAPI/ContextAPI";

export default function MenuModal({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  const { logoRef, titleRef, onHoverActive } = useContextApi();

  const cosModalRef: React.MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement | null>(null)!;

  useEffect(() => {
    if (cosModalRef.current?.className === "modal-container modal-cos") {
      const observer = new IntersectionObserver((entries) => {
        const entry = entries[0];

        if (entry.intersectionRect.height >= 280) {
          if (logoRef?.current?.className === "big-logo") {
            logoRef?.current?.classList?.add("hide");
          }
        } else {
          logoRef?.current?.classList?.remove("hide");
        }
      });

      observer.observe(cosModalRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onHoverActive]);

  return (
    <div className={`modal-container modal-${className}`} ref={cosModalRef}>
      {children}
    </div>
  );
}
