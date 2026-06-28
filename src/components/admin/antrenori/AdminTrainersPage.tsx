"use client";

import { useState } from "react";
import { ITrainerWithLocation } from "@/types/trainer";
import { ILocation } from "@/types/location";
import { deleteTrainerAction, toggleTrainerActiveAction } from "@/app/actions/trainer";
import TrainerForm from "./TrainerForm";
import "./adminTrainers.scss";

interface IAdminTrainersPageProps {
  trainers: ITrainerWithLocation[];
  locations: ILocation[];
}

export default function AdminTrainersPage({ trainers, locations }: IAdminTrainersPageProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ITrainerWithLocation | null>(null);
  const [filterLocation, setFilterLocation] = useState<string>("all");

  const filtered = filterLocation === "all"
    ? trainers
    : filterLocation === "none"
      ? trainers.filter((t) => !t.locationId)
      : trainers.filter((t) => t.location?.slug === filterLocation);

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(trainer: ITrainerWithLocation) {
    setEditing(trainer);
    setFormOpen(true);
  }

  return (
    <div className="at-wrapper">
      <div className="at-top">
        <h1 className="at-title">Antrenori</h1>
        <button className="at-btn-add" onClick={openAdd}>+ Antrenor nou</button>
      </div>

      <div className="at-filters">
        <select
          className="at-select"
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
        >
          <option value="all">Toate locațiile</option>
          <option value="none">Fără locație</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.slug}>{loc.name}</option>
          ))}
        </select>
      </div>

      <div className="at-table-wrap">
        <table className="at-table">
          <thead>
            <tr>
              <th>Nume</th>
              <th>Locație</th>
              <th>Clase</th>
              <th>Vârstă</th>
              <th>Status</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="at-empty">Nu există antrenori.</td>
              </tr>
            )}
            {filtered.map((trainer) => (
              <tr key={trainer.id} className={trainer.isActive ? "" : "at-row-inactive"}>
                <td className="at-cell-name">{trainer.name}</td>
                <td>{trainer.location?.name ?? <span className="at-muted">—</span>}</td>
                <td>
                  <div className="at-badges">
                    {trainer.classes.length > 0
                      ? trainer.classes.map((cls) => (
                          <span key={cls} className="at-badge">{cls}</span>
                        ))
                      : <span className="at-muted">{trainer.category}</span>
                    }
                  </div>
                </td>
                <td>{trainer.age ?? <span className="at-muted">—</span>}</td>
                <td>
                  <span className={`at-status ${trainer.isActive ? "active" : "inactive"}`}>
                    {trainer.isActive ? "Activ" : "Inactiv"}
                  </span>
                </td>
                <td>
                  <div className="at-row-actions">
                    <button className="at-btn-edit" onClick={() => openEdit(trainer)}>Editează</button>
                    <form action={toggleTrainerActiveAction.bind(null, trainer.id, !trainer.isActive)}>
                      <button type="submit" className="at-btn-toggle">
                        {trainer.isActive ? "Dezactivează" : "Activează"}
                      </button>
                    </form>
                    <form action={deleteTrainerAction.bind(null, trainer.id)}
                      onSubmit={(e) => {
                        if (!confirm(`Ștergi antrenorul "${trainer.name}"?`)) e.preventDefault();
                      }}
                    >
                      <button type="submit" className="at-btn-delete">Șterge</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <TrainerForm
          trainer={editing ?? undefined}
          locations={locations}
          onClose={() => setFormOpen(false)}
        />
      )}
    </div>
  );
}
