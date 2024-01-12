import React from "react";
import LogInForm from "@/components/form/LogInForm";

const page = () => {
  return (
    <section className="background-light800_darkgradient flex  h-screen w-full flex-col gap-8 p-8">
      <h2 className="h2-bold text-light850_dark500 font-noto_sans ">
        {" "}
        Login With Your Credentials
      </h2>
      <LogInForm />
    </section>
  );
};

export default page;
