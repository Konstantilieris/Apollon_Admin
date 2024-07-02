import React from "react";
import Image from "next/image";
import Link from "next/link";
import MobileNav from "./MobileNav";
import Theme from "./Theme";
import AuthSwitch from "./AuthSwitch";
import { getServerSession } from "next-auth";
import { cn } from "@/lib/utils";
import GlobalSearch from "../shared/searchBar/GlobalSearch";

const Navbar = async () => {
  const session = await getServerSession();

  return (
    <nav
      className={cn(
        "background-light900_dark200 fixed z-30  top-0 flex min-h-[10vh] w-full gap-5  p-6  sm:px-12 flex-row items-center",
        { "justify-between": !session }
      )}
    >
      <div className="flex  basis-2/6 flex-row gap-8 justify-self-start">
        <Link
          href={"/main"}
          className=" animate-on-hover flex items-center gap-1"
        >
          <Image
            src="/assets/icons/bone.svg"
            width={60}
            height={40}
            alt="Bone"
            className="animate-on-hover-image invert-colors  "
          />
        </Link>
        <p className="max-sm:hidden">
          <span className=" text-dark300_light900   font-noto_sans text-[36px] font-extrabold lg:text-[50px]">
            Apollon Admin
          </span>
        </p>
      </div>

      {session && (
        <div className=" ml-20 flex basis-2/6 justify-items-center gap-4">
          <GlobalSearch />
        </div>
      )}

      <div className={cn("justify-end flex gap-5 basis-2/6")}>
        <AuthSwitch />
        <Theme />
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
