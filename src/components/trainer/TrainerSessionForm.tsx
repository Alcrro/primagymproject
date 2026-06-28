"use client";

import { useRef } from "react";
import { createSessionAction, updateSessionAction } from "@/app/actions/session";
import { IClassSession } from "@/types/booking";
import { ILocation } from "@/types/location";
import "./trainer.scss";

const CATEGORIES = ["zumba", "aerobic", "cycling", "fitness"];

interface ITrainerSessionFormProps {
  session?: IClassSession;
  locations: ILocation[];
  onClose: () => void;
}

function toLocalDatetimeValue(date?: Date) {
  if (!date) return "";
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export default function TrainerSessionForm({ session, locations, onClose }: ITrainerSessionFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const isEdit = !!session;

  async function handleSubmit(formData: FormData) {
    if (isEdit) await updateSessionAction(formData);
    else await createSessionAction(formData);
    onClose();
  }

  return (
    <div className="tsf-overlay" onClick={onClose}>
      <div className="tsf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tsf-header">
          <h2 className="tsf-title">{isEdit ? "Editează sesiune" : "Sesiune nouă"}</h2>
          <button className="tsf-close" onClick={onClose} aria-label="Închide">✕</button>
        </div>

        <form ref={formRef} action={handleSubmit} className="tsf-form">
          {isEdit && <input type="hidden" name="id" value={session.id} />}

          <div className="tsf-row">
            <label className="tsf-label">
              Categorie *
              <select className="tsf-input" name="categorySlug" required defaultValue={session?.categorySlug ?? ""}>
                <option value="">— alege —</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </label>
            <label className="tsf-label">
              Locație
              <select className="tsf-input" name="locationId" defaultValue={session?.locationId ?? ""}>
                <option value="">— fără locație —</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="tsf-label">
            Data și ora *
            <input
              className="tsf-input"
              name="startAt"
              type="datetime-local"
              required
              defaultValue={toLocalDatetimeValue(session?.startAt)}
            />
          </label>

          <div className="tsf-row">
            <label className="tsf-label">
              Durată (minute)
              <input className="tsf-input" name="durationMinutes" type="number" min="15" max="180" defaultValue={session?.durationMinutes ?? 60} />
            </label>
            <label className="tsf-label">
              Capacitate maximă
              <input className="tsf-input" name="maxCapacity" type="number" min="1" max="100" defaultValue={session?.maxCapacity ?? 20} />
            </label>
          </div>

          <label className="tsf-label">
            Note (opțional)
            <textarea className="tsf-textarea" name="notes" rows={2} defaultValue={session?.notes ?? ""} />
          </label>

          <div className="tsf-actions">
            <button type="button" className="tsf-btn-cancel" onClick={onClose}>Anulează</button>
            <button type="submit" className="tsf-btn-save">{isEdit ? "Salvează" : "Creează"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
