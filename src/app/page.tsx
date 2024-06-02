import "../components/home/home.scss";
import LogoHome from "../components/home/logo/TitleHome";
import MultipleSections from "../components/home/sections/MultipleSections";

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
