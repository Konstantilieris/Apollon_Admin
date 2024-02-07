import Sidebar from "@/components/dashboard/sidebar/Sidebar";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex">
      <Sidebar />
      <section className="background-lightgrad_darkgrad custom-scrollbar min-h-screen  w-full p-6 max-md:pb-14 sm:px-14">
        {children}
      </section>
    </main>
  );
}
