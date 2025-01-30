/* eslint-disable tailwindcss/no-custom-classname */

import { getAllClientsByQuery } from "@/lib/actions/client.action";

import React from "react";
import Image from "next/image";
import ClientRegistration from "@/components/createClient/ClientRegistration";
import { getConstant } from "@/lib/actions/constant.action";
const page = async () => {
  const clients = await getAllClientsByQuery();
  const [professions, breeds, behaviors, foods] = await Promise.all([
    getConstant("Professions"),
    getConstant("Breeds"),
    getConstant("Behaviors"),
    getConstant("Foods"),
  ]);

  return (
    <div className="flex h-full">
      <section className="remove-scrollbar relative flex-1 overflow-y-auto px-[5%] ">
        <div className=" size-full mx-auto flex max-w-[860px] flex-1 flex-col py-10   2xl:justify-items-center">
          <ClientRegistration
            clients={clients}
            professions={professions}
            breeds={breeds}
            behaviors={behaviors}
            foods={foods}
          />

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
