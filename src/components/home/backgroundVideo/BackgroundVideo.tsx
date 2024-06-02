import "./backgroundVideo.scss";

export default function BackgroundVideo() {
  return (
    <div className="background-video-container" style={{ display: "block" }}>
      <video autoPlay muted loop>
        <source src={"./videos/backgroundVideo.webm"} />
      </video>
    </div>
  );
}
