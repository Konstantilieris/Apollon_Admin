import ClientTable from "@/components/clients/ClientTable";

import LoadingSkeleton from "@/components/shared/skeletons/LoadingSkeleton";
import { getClients } from "@/lib/actions/client.action";
import { getConstant } from "@/lib/actions/constant.action";

import React, { Suspense } from "react";

const Clients = async () => {
  const [clients, professions] = await Promise.all([
    getClients(),
    getConstant("Professions"),
  ]);

  return (
    <section className=" flex h-screen max-h-[2200px] w-full flex-row  py-2">
      <div className="  custom-scrollbar flex w-full flex-1 flex-col   gap-8  overflow-y-auto scroll-smooth px-5  py-7 max-2xl:gap-2 max-2xl:py-8 sm:px-8">
        <header className=" flex flex-col justify-between gap-8 max-2xl:gap-2">
          <div className="flex flex-col gap-1">
            <h1 className="text-dark100_light900 font-semibold max-lg:text-sm lg:text-lg">
              {" "}
              ΔΙΑΧΕΙΡΙΣΗ
              <span className="text-yellow-500">&nbsp;ΠΕΛΑΤΩΝ</span>
            </h1>
          </div>

          <div className="mb-32">
            <Suspense
              fallback={<LoadingSkeleton size={20} animation="animate-spin" />}
            >
              {" "}
              <ClientTable
                clients={JSON.parse(clients)}
                professions={professions.value}
              />
            </Suspense>
          </div>
        </header>
      </div>
    </section>
  );
};

export default Clients;
