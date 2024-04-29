/* eslint-disable camelcase */
import type { Metadata } from "next";
// eslint-disable-next-line camelcase
import {
  Inter,
  Changa,
  Noto_Sans_Display,
  Chakra_Petch,
  Rubik_Moonrocks,
} from "next/font/google";
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
const changa = Changa({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-changa",
});
const chakra = Chakra_Petch({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-chakra",
});
const noto_sans = Noto_Sans_Display({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-noto_sans",
});
const rubik = Rubik_Moonrocks({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-rubik_moonrocks",
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
        className={`${inter.variable} ${changa.variable} ${noto_sans.variable} ${chakra.variable} ${rubik.variable} custom-scrollbar  background-light700_dark400 h-screen scroll-smooth`}
      >
        <AuthProvider>
          <ThemeProvider>
            <Navbar />

            {children}
          </ThemeProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
