export default function Home() {
  return (
    <main className="  mt-28 flex h-full w-full flex-col">
      <div className="  z-0 flex  w-full flex-row bg-black lg:max-h-[76.7vh] 2xl:max-h-[80vh]">
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
      <div className="background-light900_dark200  text-dark300_light900 flex  min-h-[11vh] items-center justify-between px-4 font-bold text-white">
        <p>
          Empowering your pet care journey – Welcome to the Apollon Dog Center
          Admin Dashboard, expertly crafted by Konstantilieris development team.
        </p>
        <p>© 2024 Apollon Dog Center</p>
      </div>
    </main>
  );
}
