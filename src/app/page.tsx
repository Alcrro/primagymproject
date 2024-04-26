import "../components/home/home.scss";
import LogoHome from "@/components/home/logo/TitleHome";
import MultipleSections from "@/components/home/sections/MultipleSections";
export default function Home() {
  return (
    <>
      <div className="multiple-sections">
        <LogoHome />
      </div>
      <MultipleSections />
    </>
  );
}
