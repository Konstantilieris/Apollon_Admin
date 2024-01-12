export default function Home() {
  return (
    <main className="background-light700_dark400 flex min-h-screen  w-full  flex-col justify-between ">
      <div className="  z-0 flex h-[60vh] w-full flex-row bg-black">
        {/* responsive text size ,responsive change of positionings */}
        <p className="hero-text font-noto_sans tracking-widest">
          WELCOME TO APOLLON DOG CENTER
        </p>
        <video
          className="z-0 w-full object-cover"
          src="/assets/videos/heroDog.mp4"
          loop
          muted
          autoPlay
          playsInline
        ></video>
      </div>
    </main>
  );
}
