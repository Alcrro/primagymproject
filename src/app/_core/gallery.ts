import { StaticImageData } from "next/image";
import photo1 from "../../../public/gallery/photo1.jpg";
import photo2 from "../../../public/gallery/photo2.jpg";
import photo3 from "../../../public/gallery/photo3.jpg";
import photo4 from "../../../public/gallery/photo4.jpg";
import goodVibe from "../../../public/gallery/goodVibe.jpg";
import insideGym from "../../../public/gallery/insideGym.jpg";
import jump from "../../../public/gallery/jump.jpg";
import pushupGirl from "../../../public/gallery/pushupGirl.jpg";
import zumbaHuman from "../../../public/gallery/zumbaHuman.jpg";
import bb from "../../../public/gallery/bb.jpg";
import nicePeople from "../../../public/gallery/nicePeople.jpg";

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
  {
    id: "5",
    name: "goodVibe.jpg",
    src: goodVibe,
  },
  {
    id: "6",
    name: "insideGym.jpg",
    src: insideGym,
  },
  {
    id: "7",
    name: "jump.jpg",
    src: jump,
  },
  {
    id: "8",
    name: "pushupGirl.jpg",
    src: pushupGirl,
  },
  {
    id: "9",
    name: "zumbaHuman.jpg",
    src: zumbaHuman,
  },
  {
    id: "10",
    name: "bb.jpg",
    src: bb,
  },
  {
    id: "11",
    name: "nicePeople.jpg",
    src: nicePeople,
  },
];

export default gallery;
