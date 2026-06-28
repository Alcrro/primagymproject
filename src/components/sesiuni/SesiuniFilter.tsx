"use client";

import { useRouter, useSearchParams } from "next/navigation";
import "./sesiuni.scss";

const CATEGORIES = [
  { slug: "", label: "Toate" },
  { slug: "zumba", label: "Zumba" },
  { slug: "aerobic", label: "Aerobic" },
  { slug: "cycling", label: "Cycling" },
  { slug: "fitness", label: "Fitness" },
];

const VIEWS = [
  { value: "grid", label: "Grid" },
  { value: "calendar", label: "Calendar" },
];

export default function SesiuniFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("categorie") ?? "";
  const view = searchParams.get("view") ?? "grid";

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/sesiuni${params.size ? `?${params.toString()}` : ""}`);
  }

  return (
    <div className="sf-toolbar">
      <div className="sf-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            className={`sf-btn${active === cat.slug ? " sf-btn--active" : ""}`}
            onClick={() => updateParam("categorie", cat.slug || null)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="sv-toggle">
        {VIEWS.map((v) => (
          <button
            key={v.value}
            className={`sv-btn${view === v.value ? " sv-btn--active" : ""}`}
            onClick={() => updateParam("view", v.value === "grid" ? null : v.value)}
            title={v.label}
          >
            {v.value === "grid" ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="1" width="6" height="6" rx="1"/>
                <rect x="9" y="1" width="6" height="6" rx="1"/>
                <rect x="1" y="9" width="6" height="6" rx="1"/>
                <rect x="9" y="9" width="6" height="6" rx="1"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="1" width="14" height="3" rx="1"/>
                <rect x="1" y="6.5" width="14" height="3" rx="1"/>
                <rect x="1" y="12" width="14" height="3" rx="1"/>
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
