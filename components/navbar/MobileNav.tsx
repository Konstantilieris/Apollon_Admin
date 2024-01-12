"use client";
import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import Image from "next/image";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
const NavContent = () => {
  const pathname = usePathname();
  return (
    <section className="flex h-full flex-col  justify-evenly gap-6 pt-16 ">
      {sidebarLinks.map((item) => {
        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;
        return (
          <SheetClose asChild key={item.route}>
            <Link
              href={item.route}
              className={`${
                isActive
                  ? "primary-gradient rounded-lg text-light-900"
                  : "text-dark300_light900"
              }  hover:secondary-gradient flex items-center justify-start gap-4 rounded-lg bg-transparent p-4`}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={25}
                height={25}
                className={`${isActive ? "" : "invert-colors"}`}
              />
              <p
                className={`font-chakra text-[30px] font-semibold ${
                  isActive ? "font-extrabold" : ""
                }`}
              >
                {item.label}
              </p>
            </Link>
          </SheetClose>
        );
      })}
    </section>
  );
};
const MobileNav = () => {
  const { status } = useSession();
  if (status !== "authenticated") {
    return <></>;
  } else {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Image
            src={"/assets/icons/hamburger.svg"}
            width={38}
            height={36}
            alt="menu"
            className="invert-colors cursor-pointer sm:hidden"
          />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="background-light900_dark200 border-none max-w-[300px]"
        >
          <Link
            href="/main"
            className=" flex items-center gap-1 hover:animate-pulse"
          >
            <Image
              src="/assets/icons/bone.svg"
              width={40}
              height={40}
              alt="Bone"
            />

            <span className="ml-4 font-noto_sans text-[35px] font-bold text-sky-blue">
              Apollo Guard{" "}
            </span>
          </Link>
          <div>
            <SheetClose asChild>
              <NavContent />
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    );
  }
};

export default MobileNav;
