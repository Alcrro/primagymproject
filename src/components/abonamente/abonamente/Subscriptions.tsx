import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default async function Subscriptions() {
  const categories = await prisma.subscriptionCategory.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div className="abonamente-container">
      <div className="abonamente-inner">
        {categories.map((category) => (
          <div className={`${category.slug}-container`} key={category.slug}>
            <Link href={`/abonamente/${category.slug}`} className="relative">
              <Image
                src={category.imageUrl ?? `/cardsImages/${category.slug}.jpg`}
                alt={category.name}
                className="image"
                width={1000}
                height={1000}
              />
              <span className="description text-white">{category.name}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
