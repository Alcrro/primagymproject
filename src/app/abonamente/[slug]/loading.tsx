import SubscriptionCardSkeleton from '@/components/abonamente/subscriptionCard/SubscriptionCardSkeleton';
import './subscriptionCatCards.scss';

export default function Loading() {
  return (
    <div className="subscription-category-cards-container">
      <ul className="subscription-cards">
        {[0, 1, 2].map((i) => (
          <li key={i} className="card relative">
            <SubscriptionCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}
