import Sidebar from "@/components/navbar/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import "../globals.css";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="  z-10   mt-28 flex h-full w-full">
      <div className="basis-1/6">
        <Sidebar />
      </div>
      {/* Flex container to fill remaining space */}
      <section className="min-h-screen w-full basis-5/6">{children}</section>
      <Toaster />
    </main>
  );
}
