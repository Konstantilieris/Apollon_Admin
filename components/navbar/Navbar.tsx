import React from "react";
import Image from "next/image";
import Link from "next/link";
import MobileNav from "./MobileNav";
import Theme from "./Theme";
import AuthSwitch from "./AuthSwitch";
import { getServerSession } from "next-auth";

const Navbar = async () => {
  const session = await getServerSession();

  return (
    <nav className="flex-between background-light900_dark200  sticky top-0 z-50 flex min-h-[10vh] w-full gap-5 overflow-y-hidden p-6 shadow-sm shadow-white dark:shadow-slate-600 sm:px-12">
      <div className="flex flex-row gap-8">
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
        <Link
          className="flex min-h-[30px] flex-row items-center gap-2 rounded-lg bg-blue-600 p-2 font-noto_sans font-bold text-white shadow-light-400 hover:scale-105 hover:animate-pulse dark:text-slate-300 2xl:min-h-[45px] 2xl:min-w-[160px] 2xl:p-4"
          href={"/main"}
        >
          DASHBOARD{" "}
          <Image
            src="/assets/icons/admin.svg"
            width={20}
            height={20}
            alt="admin"
          />
        </Link>
      )}
      <div className="flex-between gap-5">
        <AuthSwitch />
        <Theme />
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
