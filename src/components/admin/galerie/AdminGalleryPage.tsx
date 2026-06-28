"use client"

import { useState, useTransition } from "react"
import {
  addGalleryPhotoAction,
  deleteGalleryPhotoAction,
  toggleGalleryPhotoActiveAction,
} from "@/app/actions/gallery"
import type { IGalleryPhoto } from "@/types/gallery"
import "./adminGallery.scss"

interface IAdminGalleryPageProps {
  photos: IGalleryPhoto[]
}

export default function AdminGalleryPage({ photos: initial }: IAdminGalleryPageProps) {
  const [photos, setPhotos] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function addHandler(formData: FormData) {
    setFormError(null)
    startTransition(async () => {
      const result = await addGalleryPhotoAction(formData)
      if (result.error) {
        setFormError(result.error)
      } else {
        setShowForm(false)
        // revalidatePath handles refresh via server — optimistic: reload
        window.location.reload()
      }
    })
  }

  function deleteHandler(id: number, filename: string) {
    if (!confirm(`Ștergi fotografia "${filename}"?`)) return
    startTransition(async () => {
      await deleteGalleryPhotoAction(id)
      setPhotos((prev) => prev.filter((p) => p.id !== id))
    })
  }

  function toggleHandler(id: number, isActive: boolean) {
    startTransition(async () => {
      await toggleGalleryPhotoActiveAction(id, !isActive)
      setPhotos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: !isActive } : p))
      )
    })
  }

  return (
    <div className="ag-wrapper">
      <div className="ag-top">
        <div>
          <h1 className="ag-title">Galerie</h1>
          <p className="ag-subtitle">
            {photos.filter((p) => p.isActive).length} active · {photos.length} total
          </p>
        </div>
        <button className="ag-btn-add" onClick={() => setShowForm(true)}>
          + Adaugă fotografie
        </button>
      </div>

      {showForm && (
        <div className="ag-form-card">
          <h2 className="ag-form-title">Fotografie nouă</h2>
          <form action={addHandler} className="ag-form">
            <div className="ag-field">
              <label className="ag-label">URL imagine *</label>
              <input
                name="url"
                type="text"
                className="ag-input"
                placeholder="/gallery/photo5.jpg sau https://..."
                required
                autoFocus
              />
              <span className="ag-hint">
                Fișiere locale: copiază în <code>public/gallery/</code> și scrie <code>/gallery/numefisier.jpg</code>
              </span>
            </div>
            <div className="ag-field">
              <label className="ag-label">Text alternativ (alt)</label>
              <input
                name="altText"
                type="text"
                className="ag-input"
                placeholder="Descriere scurtă a imaginii..."
              />
            </div>
            {formError && <p className="ag-error">{formError}</p>}
            <div className="ag-form-actions">
              <button type="submit" className="ag-btn-save" disabled={isPending}>
                {isPending ? "Se adaugă..." : "Adaugă"}
              </button>
              <button
                type="button"
                className="ag-btn-cancel"
                onClick={() => { setShowForm(false); setFormError(null) }}
              >
                Anulează
              </button>
            </div>
          </form>
        </div>
      )}

      {photos.length === 0 ? (
        <div className="ag-empty">
          <p className="ag-empty-text">Nicio fotografie în galerie.</p>
          <p className="ag-empty-sub">Adaugă prima fotografie folosind butonul de mai sus.</p>
        </div>
      ) : (
        <div className="ag-grid">
          {photos.map((photo) => (
            <div key={photo.id} className={`ag-card${photo.isActive ? "" : " ag-card--inactive"}`}>
              <div className="ag-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={photo.altText ?? photo.filename} className="ag-img" />
                {!photo.isActive && <div className="ag-inactive-overlay">Ascunsă</div>}
              </div>
              <div className="ag-card-body">
                <p className="ag-filename">{photo.filename}</p>
                {photo.altText && <p className="ag-alt">{photo.altText}</p>}
                <p className="ag-order">Ordine: #{photo.sortOrder}</p>
              </div>
              <div className="ag-card-actions">
                <button
                  className={`ag-btn-toggle${photo.isActive ? "" : " ag-btn-toggle--off"}`}
                  onClick={() => toggleHandler(photo.id, photo.isActive)}
                  disabled={isPending}
                >
                  {photo.isActive ? "Ascunde" : "Afișează"}
                </button>
                <button
                  className="ag-btn-delete"
                  onClick={() => deleteHandler(photo.id, photo.filename)}
                  disabled={isPending}
                >
                  Șterge
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
