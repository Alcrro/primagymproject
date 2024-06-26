import "../components/home/home.scss";
import LogoHome from "@/components/home/logo/TitleHome";
import MultipleSections from "@/components/home/sections/MultipleSections";
import ShortModal from "@/components/home/shorts/ShortModal";
export const dynamic = "force-dynamic";
export default function Home() {
  return (
    <>
      <LogoHome />
      <div className="multiple-sections">
        <MultipleSections />
      </div>
     
    </>
  );
}
