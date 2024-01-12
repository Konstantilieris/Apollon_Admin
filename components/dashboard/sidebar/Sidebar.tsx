"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "@/constants";
import Link from "next/link";
import Image from "next/image";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <section
      className="background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex flex-col justify-between overflow-y-auto border-r p-6 pt-10 shadow-light-300 dark:shadow-none max-sm:hidden lg:min-w-[266px] h-screen min-w-[110px] "
    >
      <div className=" flex flex-1 flex-col gap-6">
        {sidebarLinks.map((item) => {
          const isActive =
            (pathname.includes(item.route) && item.route.length > 1) ||
            pathname === item.route;

          return (
            <Link
              key={item.route}
              href={item.route}
              className={`${
                isActive
                  ? "secondary-gradient rounded-lg text-light-900"
                  : "text-dark300_light900"
              }  hover:primary-gradient flex items-center justify-start gap-4 rounded-lg bg-transparent p-4 `}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={30}
                height={30}
                className={`${isActive ? "" : "invert-colors"}`}
              />
              
              <p
                className={`font-chakra font-bold max-lg:hidden ${
                  isActive ? "base-bold" : "base-medium"
                }`}
              >
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Sidebar;
