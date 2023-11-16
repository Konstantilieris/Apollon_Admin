import React from "react";
import Image from "next/image";
import Link from "next/link";
import MobileNav from "./MobileNav";
import Theme from "./Theme";
const Navbar = () => {
  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12">
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/assets/images/site-logo.svg"
          width={45}
          height={45}
          alt="Bone"
        />
        <p className="h2-bold  ml-10 text-dark-100 dark:text-light-900 max-sm:hidden">
          <span className="font-changa text-[40px] font-extrabold text-sky-blue ">
            Apollo Guard
          </span>
        </p>
      </Link>

      <div className="flex-between gap-5">
        <Theme />
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
