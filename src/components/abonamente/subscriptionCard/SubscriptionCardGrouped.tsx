"use client";
import { useState } from 'react';
import { ICart } from '@/types/subscription';
import { useAddToCart } from '@/context/addToCart/AddToCartContext';
import Image, { StaticImageData } from 'next/image';
import React from 'react';

interface Props {
  plans: ICart[];
  imageCard: StaticImageData;
  label: string;
  featured?: boolean;
}

function optionLabel(plan: ICart): string {
  if (plan.description) return `${plan.description} — ${plan.price} RON`;
  if (plan.planType === 'entries') {
    return `${plan.pass} ${(plan.pass ?? 0) < 2 ? 'ședință' : 'ședințe'} — ${plan.price} RON`;
  }
  return `${plan.durationMonths} ${plan.durationMonths === 1 ? 'lună' : 'luni'} — ${plan.price} RON`;
}

export default function SubscriptionCardGrouped({ plans, imageCard, label, featured }: Props) {
  const { addToCartHandler } = useAddToCart();
  const [selectedId, setSelectedId] = useState(plans[0]?.id ?? 0);

  const selected = plans.find((p) => p.id === selectedId) ?? plans[0];
  if (!selected) return null;

  const displayNumber = selected.planType === 'entries' ? selected.pass : selected.durationMonths;
  const displayUnit =
    selected.planType === 'entries'
      ? (selected.pass ?? 0) < 2 ? 'ședință' : 'ședințe'
      : selected.durationMonths === 1 ? 'lună' : 'luni';

  return (
    <div className="subscription-card">
      <Image
        src={imageCard}
        alt={`Abonament ${selected.category} – ${label}`}
        fill
        className="card-bg-image"
        sizes="(max-width: 768px) 100vw, 420px"
      />
      <div className="card-overlay">
        <div className="card-top">
          {featured && <span className="card-badge-featured">Cel mai ales</span>}
          <span className="card-badge">{selected.category.toUpperCase()}</span>
        </div>

        <div className="card-bottom">
          <p className="card-label">{label}</p>

          <div className="card-info">
            <div className="pass-block">
              <span className="pass-number">{displayNumber}</span>
              <span className="pass-unit">{displayUnit}</span>
            </div>
            <div className="price-block">
              <span className="price-amount">{selected.price}</span>
              <span className="price-unit"> RON</span>
            </div>
          </div>

          <select
            value={selectedId}
            onChange={(e) => setSelectedId(Number(e.target.value))}
            className="plan-select"
            aria-label={`Alege planul ${label}`}
          >
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {optionLabel(p)}
              </option>
            ))}
          </select>

          <button
            className="card-cta"
            onClick={() => addToCartHandler(selected)}
            type="button"
          >
            Doresc abonament
          </button>
        </div>
      </div>
    </div>
  );
}
