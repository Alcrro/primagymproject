import "./backgroundVideo.scss";
export default function BackgroundVideo() {
  return (
    <div className="background-video-container">
      <video autoPlay muted loop>
        <source src={"./videos/backgroundVideo.webm"} />
      </video>
    </div>
  );
}
