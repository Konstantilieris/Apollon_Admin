import React from "react";
import Image from "next/image";
import Link from "next/link";
import MobileNav from "./MobileNav";
import Theme from "./Theme";
import AuthSwitch from "./AuthSwitch";

const Navbar = async () => {
  return (
    <nav className="flex-between background-light900_dark200 sticky top-0 z-50 min-h-[10vh] w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12">
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
        <p className="  ml-10  max-sm:hidden">
          <span className=" text-dark300_light900   font-noto_sans text-[36px] font-extrabold lg:text-[50px]">
            Apollon Admin
          </span>
        </p>
      </Link>

      <div className="flex-between gap-5">
        <AuthSwitch />
        <Theme />
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
