"use client";
import { useRef, useState, useEffect, useCallback } from 'react';
import { ICart } from '@/types/subscription';
import { StaticImageData } from 'next/image';
import SubscriptionCard from '@/components/abonamente/subscriptionCard/SubscriptionCard';

interface ISubscriptionCarouselProps {
  plans: ICart[];
  imageCard: StaticImageData;
  slug: string;
}

export default function SubscriptionCarousel({ plans, imageCard, slug }: ISubscriptionCarouselProps) {
  const scrollRef = useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.offsetWidth;
    setActiveIndex(Math.round(el.scrollLeft / cardWidth));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollTo = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.offsetWidth, behavior: 'smooth' });
  }, []);

  const prev = () => scrollTo(Math.max(activeIndex - 1, 0));
  const next = () => scrollTo(Math.min(activeIndex + 1, plans.length - 1));

  return (
    <div className="subscription-category-cards-container">
      <ul ref={scrollRef} className={`subscription-cards ul-${slug}`}>
        {plans.map((plan) => (
          <li key={plan.id} className={`card ${slug} relative`}>
            <SubscriptionCard category={plan} imageCard={imageCard} />
          </li>
        ))}
      </ul>

      {plans.length > 1 && (
        <div className="carousel-controls md:hidden flex items-center justify-between px-4 pt-3">
          <button
            onClick={prev}
            disabled={activeIndex === 0}
            aria-label="Plan anterior"
            className="w-9 h-9 rounded-full bg-card flex items-center justify-center disabled:opacity-30 transition-opacity"
          >
            <i className="bi bi-chevron-left text-content" />
          </button>

          <div className="carousel-dots">
            {plans.map((_, i) => (
              <span
                key={i}
                className={`dot${i === activeIndex ? ' active' : ''}`}
                onClick={() => scrollTo(i)}
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={activeIndex === plans.length - 1}
            aria-label="Plan următor"
            className="w-9 h-9 rounded-full bg-card flex items-center justify-center disabled:opacity-30 transition-opacity"
          >
            <i className="bi bi-chevron-right text-content" />
          </button>
        </div>
      )}
    </div>
  );
}
