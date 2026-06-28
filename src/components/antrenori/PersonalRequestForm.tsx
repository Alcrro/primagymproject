"use client";

import { useState } from "react";
import { sendPersonalRequestAction } from "@/app/actions/personalRequest";
import Link from "next/link";
import "./personalRequestForm.scss";

interface IPersonalRequestFormProps {
  trainerId: number;
  trainerName: string;
}

export default function PersonalRequestForm({ trainerId, trainerName }: IPersonalRequestFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; error?: string; redirect?: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setResult(null);
    const res = await sendPersonalRequestAction(formData);
    setLoading(false);
    setResult(res ?? { success: true });
    if (res?.success) setOpen(false);
  }

  if (result?.success) {
    return <p className="prf-success">✓ Cerere trimisă! Antrenorul te va contacta în curând.</p>;
  }

  return (
    <div className="prf-wrap">
      {!open ? (
        <button className="prf-trigger" onClick={() => setOpen(true)}>
          Solicită ședință personală
        </button>
      ) : (
        <div className="prf-form-wrap">
          <h3 className="prf-title">Ședință cu {trainerName}</h3>
          <form action={handleSubmit} className="prf-form">
            <input type="hidden" name="trainerId" value={trainerId} />

            <label className="prf-label">
              Data și ora dorită *
              <input className="prf-input" name="requestedAt" type="datetime-local" required />
            </label>

            <label className="prf-label">
              Mesaj (opțional)
              <textarea className="prf-textarea" name="message" rows={3} placeholder="Descrie pe scurt obiectivele tale..." />
            </label>

            {result?.error && (
              <p className="prf-error">
                {result.error}
                {result.redirect && <> — <Link href={result.redirect} className="prf-link">Vezi abonamente</Link></>}
              </p>
            )}

            <div className="prf-actions">
              <button type="button" className="prf-btn-cancel" onClick={() => setOpen(false)}>Renunță</button>
              <button type="submit" className="prf-btn-submit" disabled={loading}>
                {loading ? "Se trimite..." : "Trimite cererea"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
