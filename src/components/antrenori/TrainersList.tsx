import Link from "next/link";
import Image from "next/image";
import { ITrainer } from "@/types/trainer";
import "./trainersList.scss";

interface ITrainersListProps {
  trainers: ITrainer[];
  locationSlug: string;
}

function avgRating(reviews: { rating: number }[]): number {
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}

function TrainerListCard({ trainer, locationSlug }: { trainer: ITrainer; locationSlug: string }) {
  const reviews = trainer.reviews ?? [];
  const avg = reviews.length > 0 ? avgRating(reviews) : null;
  const rounded = avg !== null ? Math.round(avg) : 0;

  return (
    <Link href={`/antrenori/${locationSlug}/${trainer.id}`} className="tl-card">
      <div className="tl-photo">
        {trainer.thumbnail ? (
          <Image
            src={`/profileTrainers/${trainer.thumbnail}.png`}
            alt={trainer.name}
            width={120}
            height={120}
          />
        ) : (
          <div className="tl-photo-placeholder" aria-hidden="true">
            {trainer.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="tl-info">
        <span className="tl-name">{trainer.name}</span>
        {trainer.description && <p className="tl-description">{trainer.description}</p>}
        {trainer.age !== null && <span className="tl-age">{trainer.age} ani</span>}
        <div className="tl-badges">
          {trainer.classes.length > 0
            ? trainer.classes.map((cls) => (
                <span key={cls} className="tl-badge">{cls}</span>
              ))
            : <span className="tl-badge">{trainer.category}</span>
          }
        </div>
        <div className={`tl-rating${reviews.length === 0 ? " tl-rating--empty" : ""}`} aria-label={`Rating: ${avg !== null ? avg.toFixed(1) : "0"} din 5`}>
          <span className="tl-stars">
            {avg !== null
              ? <>{"★".repeat(rounded)}{"☆".repeat(5 - rounded)}</>
              : "☆☆☆☆☆"
            }
          </span>
          <span className="tl-rating-text">
            {avg !== null ? `${avg.toFixed(1)} (${reviews.length})` : "Fără review-uri"}
          </span>
        </div>
      </div>
      <span className="tl-arrow" aria-hidden="true">→</span>
    </Link>
  );
}

export default function TrainersList({ trainers, locationSlug }: ITrainersListProps) {
  if (trainers.length === 0) {
    return (
      <p className="tl-empty">Nu există antrenori disponibili momentan.</p>
    );
  }

  return (
    <ul className={`tl-grid${trainers.length === 1 ? " single" : ""}`}>
      {trainers.map((trainer) => (
        <li key={trainer.id}>
          <TrainerListCard trainer={trainer} locationSlug={locationSlug} />
        </li>
      ))}
    </ul>
  );
}
