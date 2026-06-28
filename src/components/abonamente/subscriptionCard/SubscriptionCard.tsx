"use client";
import { ICart } from '@/types/subscription';
import { useAddToCart } from '@/context/addToCart/AddToCartContext';
import Image, { StaticImageData } from 'next/image';
import React from 'react';

export default function SubscriptionCard({
  category,
  imageCard,
}: {
  category: ICart;
  imageCard: StaticImageData;
}) {
  const { addToCartHandler } = useAddToCart();

  return (
    <div className="subscription-card">
      <Image
        src={imageCard}
        alt={`Abonament ${category.category}`}
        fill
        className="card-bg-image"
        sizes="(max-width: 768px) 100vw, 380px"
      />
      <div className="card-overlay">
        <div className="card-top">
          <span className="card-badge">{category.category.toUpperCase()}</span>
        </div>

        <div className="card-bottom">
          <p className="card-label">Abonament</p>

          <div className="card-info">
            <div className="pass-block">
              {category.planType === 'entries' ? (
                <>
                  <span className="pass-number">{category.pass}</span>
                  <span className="pass-unit">
                    {(category.pass ?? 0) < 2 ? 'ședință' : 'ședințe'}
                  </span>
                </>
              ) : (
                <>
                  <span className="pass-number">{category.durationMonths}</span>
                  <span className="pass-unit">
                    {category.durationMonths === 1 ? 'lună' : 'luni'}
                  </span>
                </>
              )}
            </div>
            <div className="price-block">
              <span className="price-amount">{category.price}</span>
              <span className="price-unit"> RON</span>
            </div>
          </div>

          <button
            className="card-cta"
            onClick={() => addToCartHandler(category)}
            type="button"
          >
            Doresc abonament
          </button>
        </div>
      </div>
    </div>
  );
}
