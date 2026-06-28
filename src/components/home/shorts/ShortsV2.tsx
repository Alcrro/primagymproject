"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import "./shortsV2.scss";

const IMAGE_DURATION_MS = 5000;

interface IShortItem {
  id: number;
  src: string;
  label: string;
}

const shortItems: IShortItem[] = [
  { id: 1, src: "/cardsImages/cycling2.jpg", label: "Cycling" },
  { id: 2, src: "/cardsImages/zumbaCard.jpg", label: "Zumba" },
  { id: 3, src: "/cardsImages/aerobic.jpg", label: "Aerobic" },
  { id: 4, src: "/cardsImages/fitness2.jpg", label: "Fitness" },
];

function isVideo(src: string): boolean {
  return /\.(mp4|webm|ogg|mov)$/i.test(src);
}

export default function ShortsV2() {
  const [active, setActive] = useState<IShortItem | null>(null);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const closeModal = useCallback(() => {
    setActive(null);
    setProgress(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const openShort = (item: IShortItem) => {
    setActive(item);
    setProgress(0);
  };

  // Progress timer for images
  useEffect(() => {
    if (!active || isVideo(active.src)) return;

    const start = Date.now();
    intervalRef.current = setInterval(() => {
      const pct = Math.min(((Date.now() - start) / IMAGE_DURATION_MS) * 100, 100);
      setProgress(pct);
      if (pct >= 100) closeModal();
    }, 50);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, closeModal]);

  // Escape key
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, closeModal]);

  return (
    <>
      <section className="sv2s-container">
        <div className="sv2s-header">
          <span className="sv2s-label">Shorts</span>
        </div>
        <div className="sv2s-grid">
          {shortItems.map((item) => (
            <button
              key={item.id}
              className="sv2s-card"
              onClick={() => openShort(item)}
              aria-label={`Deschide short: ${item.label}`}
            >
              <div className="sv2s-img-wrap">
                <Image
                  src={item.src}
                  alt={item.label}
                  fill
                  className="sv2s-img"
                  sizes="(max-width: 600px) 160px, 200px"
                />
                <div className="sv2s-play">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              </div>
              <span className="sv2s-card-label">{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      {active && (
        <div className="sv2s-overlay" onClick={closeModal}>
          <div className="sv2s-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sv2s-progress-track">
              <div
                className="sv2s-progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>

            <button className="sv2s-close" onClick={closeModal} aria-label="Închide">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {isVideo(active.src) ? (
              <video
                src={active.src}
                autoPlay
                playsInline
                className="sv2s-video"
                onTimeUpdate={(e) => {
                  const v = e.currentTarget;
                  if (v.duration) setProgress((v.currentTime / v.duration) * 100);
                }}
                onEnded={closeModal}
              />
            ) : (
              <div className="sv2s-modal-img-wrap">
                <Image
                  src={active.src}
                  alt={active.label}
                  fill
                  className="sv2s-modal-img"
                  sizes="(max-width: 600px) 100vw, 400px"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
