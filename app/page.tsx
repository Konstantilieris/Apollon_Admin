import React from "react";
import "@/styles/theme.css";
import { ImageCarousel } from "@/components/ui/images-slider";

export default function Home() {
  return (
    <main className="   flex  h-full w-full flex-col overflow-x-hidden bg-dark-100  font-sans">
      <ImageCarousel />

      <div className="text-dark300_light900  flex h-full  items-center justify-between bg-dark-100 px-4  font-bold text-light-800">
        <p>
          Empowering your pet care journey – Welcome to the Apollon Dog Center
          Admin Dashboard, expertly crafted by Konstantilieris development team.
        </p>
        <p>© 2024 Apollon Dog Center</p>
      </div>
    </main>
  );
}
