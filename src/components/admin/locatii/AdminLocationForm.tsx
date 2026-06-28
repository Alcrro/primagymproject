"use client";

import { useRef, useState } from "react";
import { ILocation, IScheduleDay } from "@/types/location";
import { createLocationAction, updateLocationAction } from "@/app/actions/location";
import "@/components/admin/antrenori/adminTrainers.scss";
import "./adminLocatii.scss";

interface IAdminLocationFormProps {
  location?: ILocation;
  onClose: () => void;
}

const EMPTY_SCHEDULE_DAY: IScheduleDay = { days: "", open: "", close: "" };

export default function AdminLocationForm({ location, onClose }: IAdminLocationFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const isEdit = !!location;

  const [scheduleRows, setScheduleRows] = useState<IScheduleDay[]>(
    location?.schedule && location.schedule.length > 0
      ? location.schedule
      : [{ ...EMPTY_SCHEDULE_DAY }]
  );

  function addScheduleRow() {
    setScheduleRows((prev) => [...prev, { ...EMPTY_SCHEDULE_DAY }]);
  }

  function removeScheduleRow(index: number) {
    setScheduleRows((prev) => prev.filter((_, i) => i !== index));
  }

  function updateScheduleRow(index: number, field: keyof IScheduleDay, value: string) {
    setScheduleRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  }

  async function handleSubmit(formData: FormData) {
    formData.set("schedule", JSON.stringify(scheduleRows));
    if (isEdit) {
      await updateLocationAction(formData);
    } else {
      await createLocationAction(formData);
    }
    onClose();
  }

  return (
    <div className="tf-overlay" onClick={onClose}>
      <div className="tf-modal" style={{ maxWidth: "720px" }} onClick={(e) => e.stopPropagation()}>
        <div className="tf-modal-header">
          <h2 className="tf-modal-title">{isEdit ? "Editează locație" : "Locație nouă"}</h2>
          <button className="tf-close" onClick={onClose} aria-label="Închide">✕</button>
        </div>

        <form ref={formRef} action={handleSubmit} className="tf-form">
          {isEdit && <input type="hidden" name="id" value={location.id} />}

          <div className="tf-row">
            <label className="tf-label">
              Slug *
              <input
                className="tf-input"
                name="slug"
                required
                defaultValue={location?.slug ?? ""}
                placeholder="ex: sala-centrala"
              />
            </label>
            <label className="tf-label">
              Nume *
              <input
                className="tf-input"
                name="name"
                required
                defaultValue={location?.name ?? ""}
                placeholder="ex: ApexFit Centru"
              />
            </label>
          </div>

          <div className="tf-row">
            <label className="tf-label">
              Oraș
              <input
                className="tf-input"
                name="city"
                defaultValue={location?.city ?? ""}
                placeholder="ex: București"
              />
            </label>
            <label className="tf-label">
              Județ
              <input
                className="tf-input"
                name="county"
                defaultValue={location?.county ?? ""}
                placeholder="ex: Ilfov"
              />
            </label>
          </div>

          <div className="tf-row">
            <label className="tf-label">
              Cod poștal
              <input
                className="tf-input"
                name="postalCode"
                defaultValue={location?.postalCode ?? ""}
                placeholder="ex: 010101"
              />
            </label>
            <label className="tf-label">
              Adresă
              <input
                className="tf-input"
                name="address"
                defaultValue={location?.address ?? ""}
                placeholder="ex: Str. Exemplu nr. 1"
              />
            </label>
          </div>

          <div className="tf-row">
            <label className="tf-label">
              Telefon
              <input
                className="tf-input"
                name="phone"
                defaultValue={location?.phone ?? ""}
                placeholder="ex: 0721 000 000"
              />
            </label>
            <label className="tf-label">
              Email
              <input
                className="tf-input"
                name="email"
                type="email"
                defaultValue={location?.email ?? ""}
                placeholder="ex: contact@apexfit.ro"
              />
            </label>
          </div>

          <div className="tf-row">
            <label className="tf-label">
              Latitudine
              <input
                className="tf-input"
                name="lat"
                type="number"
                step="any"
                defaultValue={location?.lat ?? ""}
                placeholder="ex: 44.4268"
              />
            </label>
            <label className="tf-label">
              Longitudine
              <input
                className="tf-input"
                name="lng"
                type="number"
                step="any"
                defaultValue={location?.lng ?? ""}
                placeholder="ex: 26.1025"
              />
            </label>
          </div>

          <label className="tf-label">
            Fotografie (nume fișier)
            <input
              className="tf-input"
              name="photo"
              defaultValue={location?.photo ?? ""}
              placeholder="ex: sala-centrala.jpg"
            />
          </label>

          <label className="tf-label">
            Facilități <span className="tf-hint">(separate cu virgulă)</span>
            <input
              className="tf-input"
              name="amenities"
              defaultValue={location?.amenities.join(", ") ?? ""}
              placeholder="ex: Parcare, Vestiare, Dușuri"
            />
          </label>

          <fieldset className="tf-fieldset">
            <legend className="tf-legend">Program</legend>
            {scheduleRows.map((row, i) => (
              <div key={i} className="al-schedule-row">
                <input
                  className="tf-input"
                  placeholder="Zile (ex: Lun-Vin)"
                  value={row.days}
                  onChange={(e) => updateScheduleRow(i, "days", e.target.value)}
                />
                <input
                  className="tf-input"
                  placeholder="Deschis (ex: 07:00)"
                  value={row.open ?? ""}
                  onChange={(e) => updateScheduleRow(i, "open", e.target.value)}
                />
                <input
                  className="tf-input"
                  placeholder="Închis (ex: 22:00)"
                  value={row.close ?? ""}
                  onChange={(e) => updateScheduleRow(i, "close", e.target.value)}
                />
                <button
                  type="button"
                  className="al-schedule-remove"
                  onClick={() => removeScheduleRow(i)}
                  aria-label="Șterge rând"
                >
                  ×
                </button>
              </div>
            ))}
            <button type="button" className="al-schedule-add" onClick={addScheduleRow}>
              + Adaugă zi
            </button>
          </fieldset>

          <div className="tf-row">
            <label className="tf-label">
              Ordine
              <input
                className="tf-input"
                name="sortOrder"
                type="number"
                defaultValue={location?.sortOrder ?? 0}
              />
            </label>
            <label className="tf-checkbox-label" style={{ marginTop: "1.4rem" }}>
              <input
                type="checkbox"
                name="isActive"
                value="true"
                defaultChecked={location?.isActive ?? true}
              />
              Locație activă
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
