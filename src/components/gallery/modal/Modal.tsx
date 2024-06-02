"use client";
import { useCallback, useRef, useEffect, MouseEventHandler } from "react";
import { useRouter } from "next/navigation";
import "./galleryModal.scss";

export default function Modal({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  const overlay = useRef(null);
  const wrapper = useRef(null);
  const router = useRouter();

  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);

  const onClick: MouseEventHandler = useCallback(
    (e) => {
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
    <div
      ref={overlay}
      className={`${className}-container left-0 right-0 top-0 bottom-0 bg-black/60`}
      onClick={onClick}
    >
      <div
        ref={wrapper}
        className={`${className}-inner absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-[400px] sm:w-10/12 md:w-11/14 lg:w-2/5`}
      >
        <span className="span-gallery">{children}</span>
      </div>
    </div>
  );
}
