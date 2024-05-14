import { StaticImageData } from "next/image";
import photo1 from "../../../public/gallery/photo1.jpg";
import photo2 from "../../../public/gallery/photo2.jpg";
import photo3 from "../../../public/gallery/photo3.jpg";
import photo4 from "../../../public/gallery/photo4.jpg";

export type WonderImage = {
  id: string;
  src: StaticImageData;
  name: string;
};

const gallery: WonderImage[] = [
  {
    id: "1",
    name: "photo1.jpg",
    src: photo1,
  },
  {
    id: "2",
    name: "photo2.jpg",
    src: photo2,
  },
  {
    id: "3",
    name: "photo3.jpg",
    src: photo3,
  },
  {
    id: "4",
    name: "photo4.jpg",
    src: photo4,
  },
];

export default gallery;
