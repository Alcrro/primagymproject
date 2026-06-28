import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ITrainerWithLocation, ITrainerReview } from "@/types/trainer";
import PersonalRequestForm from "./PersonalRequestForm";
import TrainerReviewForm from "./TrainerReviewForm";
import "./trainerDetail.scss";

interface ITrainerDetailProps {
  trainer: ITrainerWithLocation;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="td-stars" aria-label={`${rating} din 5 stele`}>
      {"★".repeat(rating)}{"☆".repeat(5 - rating)}
    </span>
  );
}

function avgRating(reviews: ITrainerReview[]): string {
  if (reviews.length === 0) return "0";
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return (sum / reviews.length).toFixed(1);
}

export default async function TrainerDetail({ trainer }: ITrainerDetailProps) {
  const session = await auth();
  const isMember = session?.user.role === "MEMBER";
  const locationSlug = trainer.location?.slug ?? "";

  const reviews = await prisma.trainerReview.findMany({
    where: { trainerId: trainer.id },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });

  const hasReviewed = isMember
    ? reviews.some((r) => r.userId === session!.user.id)
    : false;

  return (
    <article className="td-container">
      <Link href={`/antrenori/${locationSlug}`} className="td-back">
        ← Înapoi la {trainer.location?.name ?? "antrenori"}
      </Link>

      <div className="td-hero">
        <div className="td-photo">
          {trainer.thumbnail ? (
            <Image
              src={`/profileTrainers/${trainer.thumbnail}.png`}
              alt={trainer.name}
              width={160}
              height={160}
            />
          ) : (
            <div className="td-photo-placeholder" aria-hidden="true">
              {trainer.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="td-meta">
          <h1 className="td-name">{trainer.name}</h1>
          {trainer.age !== null && (
            <span className="td-age">{trainer.age} ani</span>
          )}
          {trainer.location && (
            <span className="td-location">{trainer.location.name}</span>
          )}
          <div className="td-badges">
            {trainer.classes.length > 0
              ? trainer.classes.map((cls) => (
                  <span key={cls} className="td-badge">{cls}</span>
                ))
              : <span className="td-badge">{trainer.category}</span>
            }
          </div>
          {reviews.length > 0 && (
            <div className="td-rating-summary">
              <Stars rating={Math.round(Number(avgRating(reviews)))} />
              <span className="td-rating-avg">{avgRating(reviews)}</span>
              <span className="td-rating-count">({reviews.length} {reviews.length === 1 ? "review" : "review-uri"})</span>
            </div>
          )}
        </div>
      </div>

      {(trainer.bio ?? trainer.description) && (
        <section className="td-section">
          <h2 className="td-section-title">Despre</h2>
          <p className="td-bio">{trainer.bio ?? trainer.description}</p>
        </section>
      )}

      {trainer.specializations.length > 0 && (
        <section className="td-section">
          <h2 className="td-section-title">Specializări</h2>
          <div className="td-tags">
            {trainer.specializations.map((s) => (
              <span key={s} className="td-tag">{s}</span>
            ))}
          </div>
        </section>
      )}

      {trainer.certifications.length > 0 && (
        <section className="td-section">
          <h2 className="td-section-title">Certificări</h2>
          <div className="td-tags">
            {trainer.certifications.map((c) => (
              <span key={c} className="td-tag td-tag--cert">{c}</span>
            ))}
          </div>
        </section>
      )}

      {trainer.classes.length > 0 && (
        <section className="td-section">
          <h2 className="td-section-title">Clase predate</h2>
          <ul className="td-classes">
            {trainer.classes.map((cls) => (
              <li key={cls} className="td-class-item">{cls}</li>
            ))}
          </ul>
        </section>
      )}

      {isMember && trainer.isActive && (
        <section className="td-section">
          <h2 className="td-section-title">Rezervare personală</h2>
          <PersonalRequestForm trainerId={trainer.id} trainerName={trainer.name} />
        </section>
      )}

      <section className="td-section">
        <h2 className="td-section-title">
          Review-uri
          {reviews.length > 0 && <span className="td-review-count"> · {reviews.length}</span>}
        </h2>

        {reviews.length > 0 ? (
          <ul className="td-reviews">
            {reviews.map((review) => (
              <li key={review.id} className="td-review">
                <div className="td-review-header">
                  <div className="td-review-avatar" aria-hidden="true">
                    {(review.user.name ?? "?").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="td-review-name">{review.user.name ?? "Anonim"}</p>
                    <Stars rating={review.rating} />
                  </div>
                  <span className="td-review-date">
                    {new Date(review.createdAt).toLocaleDateString("ro-RO", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {review.comment && (
                  <p className="td-review-comment">{review.comment}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="td-review-empty">Niciun review încă. Fii primul!</p>
        )}

        {isMember && !hasReviewed && (
          <div className="td-review-form-wrap">
            <h3 className="td-review-form-title">Lasă un review</h3>
            <TrainerReviewForm trainerId={trainer.id} />
          </div>
        )}
      </section>

      {(trainer.instagram || trainer.email) && (
        <section className="td-section">
          <h2 className="td-section-title">Contact</h2>
          <div className="td-contact">
            {trainer.instagram && (
              <a
                href={`https://instagram.com/${trainer.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="td-contact-link"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                @{trainer.instagram}
              </a>
            )}
            {trainer.email && (
              <a href={`mailto:${trainer.email}`} className="td-contact-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                {trainer.email}
              </a>
            )}
          </div>
        </section>
      )}
    </article>
  );
}
