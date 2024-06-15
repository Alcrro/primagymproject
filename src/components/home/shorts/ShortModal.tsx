"use client";
import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
} from "react";
import ShortBody from "./ShortBody";
import "./shortModal.scss";
import { useContextApi } from "@/context/contextAPI/ContextAPI";
import { useRouter } from "next/navigation";
export default function ShortModal() {
  const { shortActive, setShortActive } = useContextApi();
  const modalRef: React.MutableRefObject<HTMLDivElement | any> = useRef();

  const overlay: React.MutableRefObject<HTMLDivElement | any> = useRef(null);
  const wrapper = useRef(null);
  const router = useRouter();

  const onDismiss = useCallback(() => {
    if (overlay.current.className === "active") {
    } else {
      setShortActive(false);
    }
    //react-hooks/exhaustive-deps
  }, [router, shortActive]);

  const onClick: MouseEventHandler = useCallback(
    (e: any) => {
      if (e.target === overlay.current || e.target === wrapper.current) {
        if (onDismiss) onDismiss();
      }
    },
    [onDismiss, overlay, wrapper]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    },
    [onDismiss]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);
  return (
    <>
      {shortActive ? (
        <div
          className={`shortModal-container ${
            shortActive ? "active" : "inActive"
          }`}
          onClick={onClick}
          ref={overlay}
        >
          <div className="short-timer"></div>
          <div className="shortModal-inner" ref={wrapper}>
            <ShortBody />
          </div>
        </div>
      ) : null}
    </>
  );
}
