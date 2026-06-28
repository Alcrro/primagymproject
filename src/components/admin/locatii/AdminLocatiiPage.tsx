"use client";

import { useState } from "react";
import { ILocation } from "@/types/location";
import { deleteLocationAction, toggleLocationActiveAction } from "@/app/actions/location";
import AdminLocationForm from "./AdminLocationForm";
import "./adminLocatii.scss";

type LocationWithCount = ILocation & { _count: { trainers: number } };

interface IAdminLocatiiPageProps {
  locations: LocationWithCount[];
}

export default function AdminLocatiiPage({ locations }: IAdminLocatiiPageProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ILocation | null>(null);

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(location: ILocation) {
    setEditing(location);
    setFormOpen(true);
  }

  return (
    <div className="al-wrapper">
      <div className="al-top">
        <h1 className="al-title">Locații</h1>
        <button className="al-btn-add" onClick={openAdd}>+ Locație nouă</button>
      </div>

      <div className="al-table-wrap">
        <table className="al-table">
          <thead>
            <tr>
              <th>Slug</th>
              <th>Nume</th>
              <th>Oraș</th>
              <th>Adresă</th>
              <th>Antrenori</th>
              <th>Status</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {locations.length === 0 && (
              <tr>
                <td colSpan={7} className="al-empty">Nu există locații.</td>
              </tr>
            )}
            {locations.map((loc) => (
              <tr key={loc.id} className={loc.isActive ? "" : "al-row-inactive"}>
                <td className="al-muted">{loc.slug}</td>
                <td className="al-cell-name">{loc.name}</td>
                <td>{loc.city ?? <span className="al-muted">—</span>}</td>
                <td>{loc.address ?? <span className="al-muted">—</span>}</td>
                <td>{loc._count.trainers}</td>
                <td>
                  <span className={`al-status ${loc.isActive ? "active" : "inactive"}`}>
                    {loc.isActive ? "Activă" : "Inactivă"}
                  </span>
                </td>
                <td>
                  <div className="al-row-actions">
                    <button className="al-btn-edit" onClick={() => openEdit(loc)}>
                      Editează
                    </button>
                    <form action={toggleLocationActiveAction.bind(null, loc.id, !loc.isActive)}>
                      <button type="submit" className="al-btn-toggle">
                        {loc.isActive ? "Dezactivează" : "Activează"}
                      </button>
                    </form>
                    <form
                      action={deleteLocationAction.bind(null, loc.id)}
                      onSubmit={(e) => {
                        if (!confirm(`Ștergi locația "${loc.name}"?`)) e.preventDefault();
                      }}
                    >
                      <button type="submit" className="al-btn-delete">Șterge</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <AdminLocationForm
          location={editing ?? undefined}
          onClose={() => setFormOpen(false)}
        />
      )}
    </div>
  );
}
