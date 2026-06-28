"use client";

import { useRef } from "react";
import { createTrainerAction, updateTrainerAction } from "@/app/actions/trainer";
import { ITrainer } from "@/types/trainer";
import { ILocation } from "@/types/location";
import "./adminTrainers.scss";

const CLASSES = ["zumba", "aerobic", "cycling", "fitness"];

interface ITrainerFormProps {
  trainer?: ITrainer;
  locations: ILocation[];
  onClose: () => void;
}

export default function TrainerForm({ trainer, locations, onClose }: ITrainerFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const isEdit = !!trainer;

  async function handleSubmit(formData: FormData) {
    if (isEdit) {
      await updateTrainerAction(formData);
    } else {
      await createTrainerAction(formData);
    }
    onClose();
  }

  return (
    <div className="tf-overlay" onClick={onClose}>
      <div className="tf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tf-modal-header">
          <h2 className="tf-modal-title">{isEdit ? "Editează antrenor" : "Antrenor nou"}</h2>
          <button className="tf-close" onClick={onClose} aria-label="Închide">✕</button>
        </div>

        <form ref={formRef} action={handleSubmit} className="tf-form">
          {isEdit && <input type="hidden" name="id" value={trainer.id} />}

          <div className="tf-row">
            <label className="tf-label">
              Nume *
              <input className="tf-input" name="name" required defaultValue={trainer?.name ?? ""} />
            </label>
            <label className="tf-label">
              Vârstă
              <input className="tf-input" name="age" type="number" min="16" max="99" defaultValue={trainer?.age ?? ""} />
            </label>
          </div>

          <div className="tf-row">
            <label className="tf-label">
              Locație
              <select className="tf-input" name="locationId" defaultValue={trainer?.locationId ?? ""}>
                <option value="">— fără locație —</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </label>
            <label className="tf-label">
              Categorie (abonamente)
              <input className="tf-input" name="category" defaultValue={trainer?.category ?? ""} placeholder="ex: zumba" />
            </label>
          </div>

          <fieldset className="tf-fieldset">
            <legend className="tf-legend">Clase predate</legend>
            <div className="tf-checkboxes">
              {CLASSES.map((cls) => (
                <label key={cls} className="tf-checkbox-label">
                  <input
                    type="checkbox"
                    name="classes"
                    value={cls}
                    defaultChecked={trainer?.classes.includes(cls)}
                  />
                  {cls}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="tf-label">
            Specializări <span className="tf-hint">(separate cu virgulă)</span>
            <input
              className="tf-input"
              name="specializations"
              defaultValue={trainer?.specializations.join(", ") ?? ""}
              placeholder="ex: Nutriție sportivă, HIIT, CrossFit"
            />
          </label>

          <label className="tf-label">
            Certificări <span className="tf-hint">(separate cu virgulă)</span>
            <input
              className="tf-input"
              name="certifications"
              defaultValue={trainer?.certifications.join(", ") ?? ""}
              placeholder="ex: NASM CPT, Zumba Instructor Level 1"
            />
          </label>

          <label className="tf-label">
            Descriere scurtă (pe card)
            <textarea className="tf-textarea" name="description" rows={2} defaultValue={trainer?.description ?? ""} />
          </label>

          <label className="tf-label">
            Bio extins (pagina de detalii)
            <textarea className="tf-textarea" name="bio" rows={4} defaultValue={trainer?.bio ?? ""} />
          </label>

          <div className="tf-row">
            <label className="tf-label">
              Instagram (fără @)
              <input className="tf-input" name="instagram" defaultValue={trainer?.instagram ?? ""} placeholder="username" />
            </label>
            <label className="tf-label">
              Email
              <input className="tf-input" name="email" type="email" defaultValue={trainer?.email ?? ""} />
            </label>
          </div>

          <div className="tf-row">
            <label className="tf-label">
              Thumbnail (nume fișier)
              <input className="tf-input" name="thumbnail" defaultValue={trainer?.thumbnail ?? ""} placeholder="ex: alexandra" />
            </label>
            <label className="tf-label">
              Ordine
              <input className="tf-input" name="sortOrder" type="number" defaultValue={trainer?.sortOrder ?? 0} />
            </label>
          </div>

          <div className="tf-actions">
            <button type="button" className="tf-btn-cancel" onClick={onClose}>Anulează</button>
            <button type="submit" className="tf-btn-save">{isEdit ? "Salvează" : "Adaugă"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
