import type { Metadata } from "next";
import { Inter, Changa } from "next/font/google";
import React from "react";
import Navbar from "@/components/navbar/Navbar";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeProvider";
const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});
const changa = Changa({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-changa",
});

export const metadata: Metadata = {
  title: "Apollo dashboard Next js",
  description: "Web App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${changa.variable}`}>
        <ThemeProvider>
          <header className="background-light850_dark100 relative flex w-full">
            <Navbar />
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
