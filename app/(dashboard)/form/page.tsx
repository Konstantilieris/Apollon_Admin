"use client";
import ClientForm from "@/components/form/ClientForm";
import React from "react";

const page = () => {
  return (
    <section className=" text-dark400_light700  flex h-full w-full flex-col ">
      <h4 className=" self-center font-noto_sans text-4xl font-semibold tracking-widest">
        Εγγραφή πελάτη
      </h4>

      <ClientForm />
    </section>
  );
};

export default page;
