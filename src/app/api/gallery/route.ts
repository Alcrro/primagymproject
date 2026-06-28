import { prisma } from '@/lib/prisma';

export async function GET() {
  const photos = await prisma.galleryPhoto.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });
  return Response.json(photos);
}
