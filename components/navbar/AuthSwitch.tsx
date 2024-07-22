"use client";
import React from "react";
import { Button } from "../ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const AuthSwitch = () => {
  const { status } = useSession();
  const router = useRouter();
  if (status === "authenticated") {
    return (
      <Button
        onClick={() => {
          sessionStorage.clear();
          signOut({ redirect: false }).then(() => {
            router.replace("./");
            router.refresh();
            // Redirect to the home page after signing out
          });
        }}
        className="auth_btn "
      >
        <Image
          src={"/assets/icons/logout.svg"}
          width={28}
          height={28}
          alt="logout"
          className="sm:hidden"
        />{" "}
        <span className="font-sans  max-sm:hidden">LOGOUT</span>
      </Button>
    );
  } else {
    return (
      <Button className="auth_btn" onClick={() => router.replace("/sign-in")}>
        <Image
          src={"/assets/icons/login.svg"}
          width={28}
          height={28}
          alt="logout"
          className="sm:hidden"
        />{" "}
        <span className="font-sans max-sm:hidden">LOGIN</span>
      </Button>
    );
  }
};

export default AuthSwitch;
