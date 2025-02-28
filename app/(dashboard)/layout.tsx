import { Toaster } from "@/components/ui/toaster";
import "../globals.css";
import React from "react";
import { AnimatedSidebar } from "@/components/navbar/Sidebar";
import { FloatingSearch } from "@/components/shared/searchBar/GlobalSearchReveal";
import { ModalProvider } from "@/providers/modal-provider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="  relative flex h-full w-full font-sans">
      <FloatingSearch />

      <AnimatedSidebar>
        <ModalProvider />

        {children}
      </AnimatedSidebar>

      <Toaster />
    </main>
  );
}
