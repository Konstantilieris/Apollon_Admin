import Sidebar from "@/components/dashboard/sidebar/Sidebar";
import { Toaster } from "@/components/ui/toaster";

import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-[90vh] xl:min-h-[86.65vh] 2xl:min-h-[90vh]">
      <div className="flex  w-full">
        <Sidebar />
        <section className="background-lightgrad_darkgrad custom-scrollbar    w-full max-md:pb-14 ">
          {children}
        </section>
      </div>
      <Toaster />
    </main>
  );
}
