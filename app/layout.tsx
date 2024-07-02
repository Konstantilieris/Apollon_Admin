/* eslint-disable camelcase */
import type { Metadata } from "next";
// eslint-disable-next-line camelcase
import { Inter, Noto_Sans_Display } from "next/font/google";
import React from "react";
import Navbar from "@/components/navbar/Navbar";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeProvider";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const noto_sans = Noto_Sans_Display({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-noto_sans",
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
      <body
        className={`${inter.variable} ${noto_sans.variable} custom-scrollbar  overscroll-y-auto bg-light-700 dark:bg-dark-300`}
      >
        <ThemeProvider>
          <AuthProvider>
            <Navbar />

            {children}
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
