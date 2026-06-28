"use client";

import { useState } from "react";
import Link from "next/link";
import { bookSessionAction, cancelBookingAction } from "@/app/actions/session";
import "./sesiuni.scss";

interface IBookingButtonProps {
  sessionId: number;
  isFull: boolean;
  isCancelled: boolean;
  isAuthenticated: boolean;
  hasBooking: boolean;
  categorySlug: string;
}

export default function BookingButton({
  sessionId, isFull, isCancelled, isAuthenticated, hasBooking, categorySlug,
}: IBookingButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [booked, setBooked] = useState(hasBooking);

  if (isCancelled) return <p className="bb-info">Această sesiune a fost anulată.</p>;

  if (!isAuthenticated) {
    return (
      <Link href="/login" className="bb-btn" style={{ display: "inline-block", textDecoration: "none" }}>
        Autentifică-te pentru a rezerva
      </Link>
    );
  }

  async function handleBook() {
    setLoading(true);
    setError(null);
    setRedirectUrl(null);
    const result = await bookSessionAction(sessionId);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
      if (result.redirect) setRedirectUrl(result.redirect);
    } else {
      setBooked(true);
    }
  }

  async function handleCancel() {
    setLoading(true);
    setError(null);
    await cancelBookingAction(sessionId);
    setLoading(false);
    setBooked(false);
  }

  return (
    <div className="bb-wrap">
      {booked ? (
        <>
          <p className="bb-success">✓ Ai un loc rezervat</p>
          <button className="bb-cancel" onClick={handleCancel} disabled={loading}>
            {loading ? "Se procesează..." : "Anulează rezervarea"}
          </button>
        </>
      ) : isFull ? (
        <button className="bb-btn" disabled>Sesiune completă</button>
      ) : (
        <button className="bb-btn" onClick={handleBook} disabled={loading}>
          {loading ? "Se procesează..." : "Rezervă loc"}
        </button>
      )}
      {error && (
        <p className="bb-error">
          {error}
          {redirectUrl && <> — <Link href={redirectUrl} style={{ color: "var(--color-primary)" }}>Vezi abonamente</Link></>}
        </p>
      )}
    </div>
  );
}
