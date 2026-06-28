import { prisma } from '@/lib/prisma';
import Modal from '@/components/gallery/modal/Modal';
import Image from 'next/image';
import React from 'react';

const page = async ({ params: { id } }: { params: { id: string } }) => {
  const photo = await prisma.galleryPhoto.findUnique({
    where: { id: parseInt(id, 10) },
  });

  if (!photo) return null;

  return (
    <Modal className="">
      <Image
        src={photo.url}
        alt={photo.altText ?? photo.filename}
        width={600}
        height={400}
        className="bg-white dark:bg-black rounded-lg mx-auto"
      />
    </Modal>
  );
};

export default page;
