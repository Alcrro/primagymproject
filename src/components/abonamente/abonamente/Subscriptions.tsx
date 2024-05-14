import { getSubCategories } from "@/app/_lib/abonamente/getSubCategories";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function Subscriptions() {
  const subscriptionsC = await getSubCategories();

  return (
    <div className="abonamente-container">
      <div className="abonamente-inner">
        {subscriptionsC.map((subscription: any, key: any) => (
          <div className={`${subscription.className}-container`} key={key}>
            <Link
              href={`/abonamente/${subscription.link}`}
              className="relative"
            >
              <Image
                src={`/cardsImages/${subscription.image}`}
                alt={subscription.className}
                className="image"
                width={1000}
                height={1000}
              />
              <span className="description text-white">
                {subscription.className}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
