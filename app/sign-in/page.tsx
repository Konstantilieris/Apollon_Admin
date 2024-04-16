import React from "react";
import LogInForm from "@/components/form/LogInForm";
import Image from "next/image";

const page = () => {
  return (
    <section className="blue-gradient dark:dark-gradient flex  h-screen w-full flex-col  gap-8 p-8">
      <h2 className="h2-bold text-light850_dark500 mt-10 flex items-center gap-4 self-center font-noto_sans italic">
        {" "}
        Συνδεθείτε στον λογαριασμό σας
        <Image
          src="/assets/icons/login-account.svg"
          width={80}
          height={50}
          alt={"something"}
        />
      </h2>
      <LogInForm />
    </section>
  );
};

export default page;
