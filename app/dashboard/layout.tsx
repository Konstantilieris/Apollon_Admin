import Sidebar from "@/components/dashboard/sidebar/Sidebar";
import React from "react";
import Navbar from "@/components/dashboard/navbar/Navbar";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div>
        <Sidebar />
      </div>
      <div>
        <Navbar />
        <section>{children}</section>
      </div>
    </div>
  );
}
