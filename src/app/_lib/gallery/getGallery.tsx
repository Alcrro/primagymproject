import { prisma } from '@/lib/prisma';
import { IGalleryPhoto } from '@/types/gallery';

export async function getGallery(): Promise<IGalleryPhoto[]> {
  return prisma.galleryPhoto.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });
}
