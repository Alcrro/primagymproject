import Image from 'next/image';
import { ITrainer } from '@/types/trainer';
import '@/components/antrenori/trainersList.scss';

function avgRating(reviews: { rating: number }[]): number {
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}

export default function TrainerCard({ trainer }: { trainer: ITrainer }) {
  const reviews = trainer.reviews ?? [];
  const avg = reviews.length > 0 ? avgRating(reviews) : null;
  const rounded = avg !== null ? Math.round(avg) : 0;

  return (
    <li className="tl-card" style={{ textDecoration: 'none', color: 'inherit' }}>
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
        {trainer.description && (
          <p className="tl-description">{trainer.description}</p>
        )}
        {trainer.age !== null && (
          <span className="tl-age">{trainer.age} ani</span>
        )}
        <div className="tl-badges">
          {trainer.classes.length > 0
            ? trainer.classes.map((cls) => (
                <span key={cls} className="tl-badge">{cls}</span>
              ))
            : <span className="tl-badge">{trainer.category}</span>
          }
        </div>
        <div className={`tl-rating${reviews.length === 0 ? ' tl-rating--empty' : ''}`}>
          <span className="tl-stars">
            {avg !== null
              ? <>{'★'.repeat(rounded)}{'☆'.repeat(5 - rounded)}</>
              : '☆☆☆☆☆'
            }
          </span>
          <span className="tl-rating-text">
            {avg !== null ? `${avg.toFixed(1)} (${reviews.length})` : 'Fără review-uri'}
          </span>
        </div>
      </div>
    </li>
  );
}
