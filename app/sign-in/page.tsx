import React from "react";
import LogInForm from "@/components/form/LogInForm";
import Image from "next/image";

const page = () => {
  return (
    <main className=" text-dark300_light700   mt-28  flex min-h-[87vh] w-full overflow-x-hidden bg-light-850 font-sans dark:bg-black 2xl:min-h-[90vh]">
      <LogInForm />
      <div className="  sticky top-0 flex  min-h-full w-full items-center justify-end max-lg:hidden">
        <div className="relative min-h-full w-full">
          <Image
            src="/assets/icons/auth-form.svg"
            alt="asset"
            width={1200}
            height={1000}
            className="absolute left-[420px] top-[14vh] rounded-lg border-2 border-light-500 shadow-light-400 dark:border-light-700 dark:shadow-slate-600"
          />
        </div>
      </div>
    </main>
  );
};

export default page;
