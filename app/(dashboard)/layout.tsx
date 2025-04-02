import { Toaster } from "@/components/ui/toaster";
import "../globals.css";
import React from "react";
import { AnimatedSidebar } from "@/components/navbar/Sidebar";

import { ModalProvider } from "@/providers/modal-provider";
import { FloatingSearchPortal } from "@/components/shared/searchBar/FloatingSearchPortal";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="  relative flex h-full w-full  overflow-x-hidden font-sans">
      <FloatingSearchPortal />

      <AnimatedSidebar>
        <ModalProvider />

        {children}
      </AnimatedSidebar>

      <Toaster />
    </main>
  );
}
