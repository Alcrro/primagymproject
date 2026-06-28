"use client";

import { useState, useTransition } from "react";
import { IDiscountCode } from "@/types/discount";
import { deleteDiscountAction, toggleDiscountActiveAction } from "@/app/actions/discount";
import DiscountForm from "./DiscountForm";
import "./adminDiscounturi.scss";

interface IAdminDiscounturiPageProps {
  codes: IDiscountCode[];
}

function formatDate(date: Date | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("ro-RO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function discountTypeLabel(code: IDiscountCode): string {
  if (code.discountPct !== null) return "Procent";
  if (code.discountRon !== null) return "Sumă fixă";
  return "—";
}

function discountValueLabel(code: IDiscountCode): string {
  if (code.discountPct !== null) return `${parseFloat(code.discountPct).toFixed(0)}%`;
  if (code.discountRon !== null) return `${parseFloat(code.discountRon).toFixed(2)} Lei`;
  return "—";
}

export default function AdminDiscounturiPage({ codes }: IAdminDiscounturiPageProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<IDiscountCode | null>(null);
  const [isPending, startTransition] = useTransition();

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(code: IDiscountCode) {
    setEditing(code);
    setFormOpen(true);
  }

  function handleToggle(id: number, current: boolean) {
    startTransition(async () => {
      await toggleDiscountActiveAction(id, !current);
    });
  }

  function handleDelete(id: number, code: string) {
    if (!confirm(`Ștergi codul "${code}"?`)) return;
    startTransition(async () => {
      await deleteDiscountAction(id);
    });
  }

  return (
    <div className="dc-wrapper">
      <div className="dc-top">
        <h1 className="dc-title">Coduri de reducere</h1>
        <button className="dc-btn-add" onClick={openAdd}>+ Cod nou</button>
      </div>

      <div className="dc-table-wrap">
        <table className="dc-table">
          <thead>
            <tr>
              <th>Cod</th>
              <th>Tip reducere</th>
              <th>Valoare</th>
              <th>Valid din</th>
              <th>Valid până</th>
              <th>Max / Utilizat</th>
              <th>Status</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {codes.length === 0 && (
              <tr>
                <td colSpan={8} className="dc-empty">Nu există coduri de reducere.</td>
              </tr>
            )}
            {codes.map((code) => (
              <tr key={code.id} className={code.isActive ? "" : "dc-row-inactive"}>
                <td className="dc-cell-code">{code.code}</td>
                <td>{discountTypeLabel(code)}</td>
                <td className="dc-cell-value">{discountValueLabel(code)}</td>
                <td className="dc-muted">{formatDate(code.validFrom)}</td>
                <td className="dc-muted">{formatDate(code.validUntil)}</td>
                <td>
                  <span className="dc-uses">
                    {code.maxUses !== null ? code.maxUses : "∞"} / {code.currentUses}
                  </span>
                </td>
                <td>
                  <span className={`dc-status ${code.isActive ? "active" : "inactive"}`}>
                    {code.isActive ? "Activ" : "Inactiv"}
                  </span>
                </td>
                <td>
                  <div className="dc-row-actions">
                    <button
                      className="dc-btn-edit"
                      onClick={() => openEdit(code)}
                    >
                      Editează
                    </button>
                    <button
                      className="dc-btn-toggle"
                      disabled={isPending}
                      onClick={() => handleToggle(code.id, code.isActive)}
                    >
                      {code.isActive ? "Dezactivează" : "Activează"}
                    </button>
                    <button
                      className="dc-btn-delete"
                      disabled={isPending}
                      onClick={() => handleDelete(code.id, code.code)}
                    >
                      Șterge
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <DiscountForm
          discount={editing ?? undefined}
          onClose={() => setFormOpen(false)}
        />
      )}
    </div>
  );
}
