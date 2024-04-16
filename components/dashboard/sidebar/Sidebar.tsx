"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
const Sidebar = () => {
  const pathname = usePathname();
  return (
    <section className="background-light900_dark200 light-border  sticky left-0 top-0  flex min-w-[110px]  flex-col     gap-4 border-r p-6 pt-10 max-sm:hidden lg:min-w-[266px] 2xl:gap-16">
      {sidebarLinks.map((item, index) => {
        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;
        const stagger = 0.2;
        const variants = {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
        return (
          <motion.div
            key={item.route}
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{
              delay: index * stagger,
              ease: "easeInOut",
              duration: 0.2,
            }}
          >
            <Link
              href={item.route}
              onClick={() => scrollTo(0, 0)}
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
                className={`font-chakra font-bold max-lg:hidden 2xl:text-[26px] ${
                  isActive ? "base-bold" : "base-medium"
                }`}
              >
                {item.label}
              </p>
            </Link>
          </motion.div>
        );
      })}
    </section>
  );
};

export default Sidebar;
