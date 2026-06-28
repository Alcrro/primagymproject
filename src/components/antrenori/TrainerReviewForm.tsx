"use client";

import { useState, useTransition } from "react";
import { submitTrainerReviewAction } from "@/app/actions/trainerReview";
import "./trainerReviewForm.scss";

interface ITrainerReviewFormProps {
  trainerId: number;
}

export default function TrainerReviewForm({ trainerId }: ITrainerReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    if (rating === 0) {
      setError("Selectează un rating.");
      return;
    }
    formData.set("rating", String(rating));
    setError(null);
    startTransition(async () => {
      const result = await submitTrainerReviewAction(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setDone(true);
      }
    });
  }

  if (done) {
    return <p className="trf-success">Mulțumim pentru review!</p>;
  }

  return (
    <form action={handleSubmit} className="trf-form">
      <input type="hidden" name="trainerId" value={trainerId} />

      <div className="trf-stars" role="group" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`trf-star${n <= (hover || rating) ? " trf-star--active" : ""}`}
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${n} ${n === 1 ? "stea" : "stele"}`}
          >
            ★
          </button>
        ))}
        {rating > 0 && (
          <span className="trf-rating-label">{rating} / 5</span>
        )}
      </div>

      <textarea
        name="comment"
        className="trf-textarea"
        rows={3}
        placeholder="Spune-ne experiența ta (opțional)..."
        maxLength={500}
      />

      {error && <p className="trf-error">{error}</p>}

      <button type="submit" className="trf-btn" disabled={isPending}>
        {isPending ? "Se trimite..." : "Trimite review"}
      </button>
    </form>
  );
}
