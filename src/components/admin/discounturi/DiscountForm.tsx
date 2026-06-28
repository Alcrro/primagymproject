"use client";

import { useState, useRef } from "react";
import { IDiscountCode } from "@/types/discount";
import { createDiscountAction, updateDiscountAction } from "@/app/actions/discount";
import "./adminDiscounturi.scss";

interface IDiscountFormProps {
  discount?: IDiscountCode;
  onClose: () => void;
}

function toDateInputValue(date: Date | null): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 16);
}

export default function DiscountForm({ discount, onClose }: IDiscountFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const isEdit = !!discount;

  const initialType: "pct" | "ron" =
    discount?.discountPct !== null && discount?.discountPct !== undefined
      ? "pct"
      : "ron";

  const initialValue =
    initialType === "pct"
      ? (discount?.discountPct ?? "")
      : (discount?.discountRon ?? "");

  const [discountType, setDiscountType] = useState<"pct" | "ron">(initialType);
  const [error, setError] = useState<string>("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError("");

    formData.set("discountType", discountType);

    const result = isEdit
      ? await updateDiscountAction(formData)
      : await createDiscountAction(formData);

    setIsPending(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    onClose();
  }

  return (
    <div className="dc-overlay" onClick={onClose}>
      <div className="dc-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dc-modal-header">
          <h2 className="dc-modal-title">
            {isEdit ? "Editează cod reducere" : "Cod reducere nou"}
          </h2>
          <button className="dc-close" onClick={onClose} aria-label="Închide">✕</button>
        </div>

        <form ref={formRef} action={handleSubmit} className="dc-form">
          {isEdit && <input type="hidden" name="id" value={discount.id} />}

          <label className="dc-label">
            Cod *
            <input
              className="dc-input"
              name="code"
              required
              defaultValue={discount?.code ?? ""}
              placeholder="ex: PROMO10"
              style={{ textTransform: "uppercase" }}
            />
          </label>

          <fieldset className="dc-fieldset">
            <legend className="dc-legend">Tip reducere</legend>
            <div className="dc-radio-group">
              <label className="dc-radio-label">
                <input
                  type="radio"
                  name="discountTypeRadio"
                  value="pct"
                  checked={discountType === "pct"}
                  onChange={() => setDiscountType("pct")}
                />
                Procent (%)
              </label>
              <label className="dc-radio-label">
                <input
                  type="radio"
                  name="discountTypeRadio"
                  value="ron"
                  checked={discountType === "ron"}
                  onChange={() => setDiscountType("ron")}
                />
                Sumă fixă (Lei)
              </label>
            </div>
            <label className="dc-label dc-label-inline">
              {discountType === "pct" ? "Valoare (%)" : "Valoare (Lei)"}
              <input
                className="dc-input"
                name="discountValue"
                type="number"
                min="0"
                step={discountType === "pct" ? "0.01" : "0.01"}
                defaultValue={String(initialValue)}
                placeholder={discountType === "pct" ? "ex: 10" : "ex: 50.00"}
              />
            </label>
          </fieldset>

          <div className="dc-row">
            <label className="dc-label">
              Valabil din
              <input
                className="dc-input"
                name="validFrom"
                type="datetime-local"
                defaultValue={toDateInputValue(discount?.validFrom ?? null)}
              />
            </label>
            <label className="dc-label">
              Valabil până
              <input
                className="dc-input"
                name="validUntil"
                type="datetime-local"
                defaultValue={toDateInputValue(discount?.validUntil ?? null)}
              />
            </label>
          </div>

          <label className="dc-label">
            Număr maxim utilizări <span className="dc-hint">(lasă gol = nelimitat)</span>
            <input
              className="dc-input"
              name="maxUses"
              type="number"
              min="1"
              defaultValue={discount?.maxUses ?? ""}
              placeholder="ex: 100"
            />
          </label>

          <label className="dc-checkbox-label">
            <input
              type="checkbox"
              name="isActive"
              value="true"
              defaultChecked={discount?.isActive ?? true}
              onChange={(e) => {
                const form = formRef.current;
                if (!form) return;
                const hidden = form.querySelector<HTMLInputElement>(
                  'input[name="isActive"][type="hidden"]'
                );
                if (hidden) hidden.value = e.target.checked ? "true" : "false";
              }}
            />
            Cod activ
          </label>
          <input
            type="hidden"
            name="isActive"
            defaultValue={discount?.isActive ?? true ? "true" : "false"}
          />

          {error && <p className="dc-error">{error}</p>}

          <div className="dc-actions">
            <button type="button" className="dc-btn-cancel" onClick={onClose}>
              Anulează
            </button>
            <button type="submit" className="dc-btn-save" disabled={isPending}>
              {isPending ? "Se salvează..." : isEdit ? "Salvează" : "Adaugă"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
