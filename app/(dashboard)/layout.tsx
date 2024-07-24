import { Toaster } from "@/components/ui/toaster";
import "../globals.css";
import React from "react";
import { AnimatedSidebar } from "@/components/navbar/Sidebar";
import { FloatingSearch } from "@/components/shared/searchBar/GlobalSearchReveal";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="  flex h-full w-full">
      <AnimatedSidebar>
        <FloatingSearch />
        {children}
      </AnimatedSidebar>

      <Toaster />
    </main>
  );
}
