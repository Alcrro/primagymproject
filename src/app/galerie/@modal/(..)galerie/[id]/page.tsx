import gallery, { WonderImage } from "@/app/_core/gallery";
import Modal from "@/components/gallery/modal/Modal";
import Image from "next/image";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useWidthContext } from "@/app/_lib/resizableWidth";

const page = ({ params: { id } }: { params: { id: string } }) => {
  const find: WonderImage = gallery.find((find) => find.id === id)!;

  return (
    <Modal>
      <Image
        src={find.src}
        alt="image"
        width={600}
        height={400}
        className="rounded-lg mx-auto"
      />
    </Modal>
  );
};

export default page;
