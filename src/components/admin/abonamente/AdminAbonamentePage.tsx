"use client";

import { useState, useTransition } from "react";
import { ICategory, IPlan } from "@/types/subscription";
import {
  toggleCategoryActiveAction,
  togglePlanActiveAction,
  updatePlanPriceAction,
} from "@/app/actions/subscription";
import "./adminAbonamente.scss";

interface IAdminAbonamentePageProps {
  categories: ICategory[];
}

interface IEditingPrice {
  planId: number;
  value: string;
}

function planLabel(plan: IPlan): string {
  if (plan.planType === "ENTRIES" && plan.entries !== null) {
    return `${plan.entries} intrări`;
  }
  if (plan.planType === "MONTHLY" && plan.durationMonths !== null) {
    return `${plan.durationMonths} lună${plan.durationMonths > 1 ? "i" : ""}`;
  }
  return "—";
}

export default function AdminAbonamentePage({ categories }: IAdminAbonamentePageProps) {
  const [editingPrice, setEditingPrice] = useState<IEditingPrice | null>(null);
  const [isPending, startTransition] = useTransition();

  function startPriceEdit(plan: IPlan) {
    setEditingPrice({ planId: plan.id, value: plan.priceRon });
  }

  function cancelPriceEdit() {
    setEditingPrice(null);
  }

  function savePriceEdit() {
    if (!editingPrice) return;
    const { planId, value } = editingPrice;
    startTransition(async () => {
      await updatePlanPriceAction(planId, value);
      setEditingPrice(null);
    });
  }

  function handleTogglePlan(planId: number, current: boolean) {
    startTransition(async () => {
      await togglePlanActiveAction(planId, !current);
    });
  }

  function handleToggleCategory(catId: number, current: boolean) {
    startTransition(async () => {
      await toggleCategoryActiveAction(catId, !current);
    });
  }

  return (
    <div className="ab-wrapper">
      <div className="ab-top">
        <h1 className="ab-title">Abonamente &amp; Prețuri</h1>
      </div>

      {categories.length === 0 && (
        <p className="ab-empty-global">Nu există categorii de abonamente.</p>
      )}

      {categories.map((cat) => (
        <section key={cat.id} className="ab-category">
          <div className="ab-category-header">
            <div className="ab-category-left">
              <span className="ab-category-name">{cat.name}</span>
              <span className={`ab-status ${cat.isActive ? "active" : "inactive"}`}>
                {cat.isActive ? "Activă" : "Inactivă"}
              </span>
            </div>
            <button
              className="ab-btn-toggle-cat"
              disabled={isPending}
              onClick={() => handleToggleCategory(cat.id, cat.isActive)}
            >
              {cat.isActive ? "Dezactivează categorie" : "Activează categorie"}
            </button>
          </div>

          <div className="ab-table-wrap">
            <table className="ab-table">
              <thead>
                <tr>
                  <th>Nume plan</th>
                  <th>Tip</th>
                  <th>Intrări / Durată</th>
                  <th>Cu antrenor</th>
                  <th>Preț (RON)</th>
                  <th>Discount %</th>
                  <th>Status</th>
                  <th>Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {cat.plans.length === 0 && (
                  <tr>
                    <td colSpan={8} className="ab-empty">Nu există planuri pentru această categorie.</td>
                  </tr>
                )}
                {cat.plans.map((plan) => (
                  <tr key={plan.id} className={plan.isActive ? "" : "ab-row-inactive"}>
                    <td className="ab-cell-name">{plan.name}</td>
                    <td>{plan.planType === "ENTRIES" ? "Intrări" : "Lunar"}</td>
                    <td>{planLabel(plan)}</td>
                    <td>
                      {plan.withTrainer === null
                        ? <span className="ab-muted">—</span>
                        : plan.withTrainer ? "Da" : "Nu"
                      }
                    </td>
                    <td className="ab-cell-price">
                      {editingPrice?.planId === plan.id ? (
                        <div className="ab-price-edit">
                          <input
                            className="ab-price-input"
                            type="number"
                            min="0"
                            step="0.01"
                            value={editingPrice.value}
                            onChange={(e) =>
                              setEditingPrice({ planId: plan.id, value: e.target.value })
                            }
                            autoFocus
                          />
                          <button
                            className="ab-btn-save-price"
                            disabled={isPending}
                            onClick={savePriceEdit}
                          >
                            Salvează
                          </button>
                          <button
                            className="ab-btn-cancel-price"
                            onClick={cancelPriceEdit}
                          >
                            Anulează
                          </button>
                        </div>
                      ) : (
                        <span className="ab-price-value">{parseFloat(plan.priceRon).toFixed(2)} lei</span>
                      )}
                    </td>
                    <td>
                      {parseFloat(plan.discountPct) > 0
                        ? <span className="ab-discount">{parseFloat(plan.discountPct).toFixed(0)}%</span>
                        : <span className="ab-muted">—</span>
                      }
                    </td>
                    <td>
                      <span className={`ab-status ${plan.isActive ? "active" : "inactive"}`}>
                        {plan.isActive ? "Activ" : "Inactiv"}
                      </span>
                    </td>
                    <td>
                      <div className="ab-row-actions">
                        {editingPrice?.planId !== plan.id && (
                          <button
                            className="ab-btn-edit"
                            onClick={() => startPriceEdit(plan)}
                          >
                            Edit preț
                          </button>
                        )}
                        <button
                          className="ab-btn-toggle"
                          disabled={isPending}
                          onClick={() => handleTogglePlan(plan.id, plan.isActive)}
                        >
                          {plan.isActive ? "Dezactivează" : "Activează"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
