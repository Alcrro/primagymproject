import { StaticImageData } from "next/image";
import photo1 from "../../../public/gallery/photo1.jpg";
import photo2 from "../../../public/gallery/photo2.jpg";
import photo3 from "../../../public/gallery/photo3.jpg";
import photo4 from "../../../public/gallery/photo4.jpg";

export type WonderImage = {
  id: string;
  src: StaticImageData;
};

const gallery: WonderImage[] = [
  {
    id: "1",
    src: photo1,
  },
  {
    id: "2",
    src: photo2,
  },
  {
    id: "3",
    src: photo3,
  },
  {
    id: "4",
    src: photo4,
  },
];

export default gallery;
