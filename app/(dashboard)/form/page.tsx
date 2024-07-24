/* eslint-disable tailwindcss/no-custom-classname */

import { getAllClientsByQuery } from "@/lib/actions/client.action";
import { replacePercent20 } from "@/lib/utils";
import React from "react";
import Image from "next/image";
import ClientRegistration from "@/components/createClient/ClientRegistration";
const page = async ({ searchParams }: any) => {
  const clients = await getAllClientsByQuery(
    replacePercent20(searchParams.q),
    5
  );

  return (
    <div className="flex h-full">
      <section className="remove-scrollbar relative flex-1 overflow-y-auto px-[5%] ">
        <div className=" size-full mx-auto flex max-w-[860px] flex-1 flex-col py-10   2xl:justify-items-center">
          <span className=" flex flex-row items-center justify-center gap-4">
            <Image
              src="/assets/icons/bone.svg"
              height={40}
              width={50}
              alt="patient"
              className="  h-12 w-11 invert"
            />
            <h1 className="header">Εγγραφή Πελάτη</h1>
          </span>
          <ClientRegistration clients={clients} />

          <p className="  justify-items-end py-12 text-center text-white xl:text-left">
            © 2024 Apollon
          </p>
        </div>
      </section>

      <Image
        src="/assets/images/clientform1.webp"
        height={1000}
        width={1200}
        alt="patient"
        className=" hidden h-full max-w-[500px] border border-l-emerald-500 object-cover dark:border-l-white md:block 2xl:max-w-[700px]"
      />
    </div>
  );
};

export default page;
