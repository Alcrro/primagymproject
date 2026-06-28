"use client";

import { useRef } from "react";
import { IClassSession } from "@/types/booking";
import { ILocation } from "@/types/location";
import { adminCreateSessionAction, adminUpdateSessionAction } from "@/app/actions/session";
import "@/components/admin/antrenori/adminTrainers.scss";

const CATEGORIES = ["zumba", "aerobic", "cycling", "fitness"];

interface IAdminSessionFormProps {
  session?: IClassSession & { trainer: { id: number; name: string }; location: { name: string } | null };
  trainers: { id: number; name: string; category: string }[];
  locations: ILocation[];
  onClose: () => void;
}

function toDatetimeLocal(date: Date): string {
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminSessionForm({ session, trainers, locations, onClose }: IAdminSessionFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const isEdit = !!session;

  async function handleSubmit(formData: FormData) {
    if (isEdit) {
      await adminUpdateSessionAction(formData);
    } else {
      await adminCreateSessionAction(formData);
    }
    onClose();
  }

  return (
    <div className="tf-overlay" onClick={onClose}>
      <div className="tf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tf-modal-header">
          <h2 className="tf-modal-title">{isEdit ? "Editează sesiune" : "Sesiune nouă"}</h2>
          <button className="tf-close" onClick={onClose} aria-label="Închide">✕</button>
        </div>

        <form ref={formRef} action={handleSubmit} className="tf-form">
          {isEdit && <input type="hidden" name="id" value={session.id} />}

          <div className="tf-row">
            <label className="tf-label">
              Antrenor *
              <select
                className="tf-input"
                name="trainerId"
                required
                defaultValue={session?.trainerId ?? ""}
              >
                <option value="">— selectează antrenor —</option>
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </label>
            <label className="tf-label">
              Locație
              <select
                className="tf-input"
                name="locationId"
                defaultValue={session?.locationId ?? ""}
              >
                <option value="">— fără locație —</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="tf-row">
            <label className="tf-label">
              Categorie *
              <select
                className="tf-input"
                name="categorySlug"
                required
                defaultValue={session?.categorySlug ?? ""}
              >
                <option value="">— selectează categorie —</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </label>
            <label className="tf-label">
              Data și ora *
              <input
                className="tf-input"
                name="startAt"
                type="datetime-local"
                required
                defaultValue={session?.startAt ? toDatetimeLocal(session.startAt) : ""}
              />
            </label>
          </div>

          <div className="tf-row">
            <label className="tf-label">
              Durată (minute)
              <input
                className="tf-input"
                name="durationMinutes"
                type="number"
                min="15"
                max="240"
                defaultValue={session?.durationMinutes ?? 60}
              />
            </label>
            <label className="tf-label">
              Capacitate maximă
              <input
                className="tf-input"
                name="maxCapacity"
                type="number"
                min="1"
                max="200"
                defaultValue={session?.maxCapacity ?? 20}
              />
            </label>
          </div>

          <label className="tf-label">
            Notițe
            <textarea
              className="tf-textarea"
              name="notes"
              rows={3}
              defaultValue={session?.notes ?? ""}
            />
          </label>

          <div className="tf-actions">
            <button type="button" className="tf-btn-cancel" onClick={onClose}>Anulează</button>
            <button type="submit" className="tf-btn-save">{isEdit ? "Salvează" : "Adaugă"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
