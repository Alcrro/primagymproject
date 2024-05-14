import gallery, { WonderImage } from "@/app/_core/gallery";
import Modal from "../../../../../components/gallery/modal/Modal";
import Image from "next/image";
import React from "react";
export const dynamic = "force-dynamic";
const page = ({ params: { id } }: { params: { id: string } }) => {
  const find: WonderImage = gallery.find((find) => find.id === id)!;

  return (
    <Modal className="">
      <Image
        src={find.src}
        alt="image"
        width={600}
        height={400}
        className=" bg-white dark:bg-black rounded-lg mx-auto "
      />
    </Modal>
  );
};

export default page;
