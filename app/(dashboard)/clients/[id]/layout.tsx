import ClientFeesCard from "@/components/clientProfile/ClientProfileCard/ClientFeesCard";
import { ClientProfileCard } from "@/components/clientProfile/ClientProfileCard/ClientProfileCard";
import ClientStatsCard from "@/components/clientProfile/ClientProfileCard/ClientStatsCard";
import ClientStatusCard from "@/components/clientProfile/ClientProfileCard/ClientStatusCard";
import { FloatingDockClient } from "@/components/clientProfile/FloatingDock";
import ServiceModalProvider from "@/components/clientProfile/Service/ServiceModalProvider";
import { getClientByIdForProfile } from "@/lib/actions/client.action";
import React from "react";
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const { id } = params;

  const client = await getClientByIdForProfile(id);
  if (!client) {
    return <div>No client Found</div>;
  }

  return (
    <main className=" relative flex h-full min-h-screen w-full flex-col  items-center ">
      <ServiceModalProvider client={JSON.parse(JSON.stringify(client))} />
      <div className="flex w-full flex-row justify-between rounded-lg px-2 py-4 dark:bg-neutral-800">
        <div className="flex w-full flex-row items-center gap-5">
          <ClientProfileCard client={JSON.parse(JSON.stringify(client))} />
          <ClientStatusCard client={JSON.parse(JSON.stringify(client))} />
        </div>
        <div className="flex w-full flex-1  flex-row items-center gap-5">
          <ClientStatsCard client={JSON.parse(JSON.stringify(client))} />
          <ClientFeesCard client={JSON.parse(JSON.stringify(client))} />
        </div>
      </div>
      <div className="flex h-full  min-h-[80vh] w-full">{children}</div>

      <FloatingDockClient id={id} />
    </main>
  );
}
