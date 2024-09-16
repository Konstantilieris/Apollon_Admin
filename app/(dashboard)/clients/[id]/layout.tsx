import ClientFeesCard from "@/components/clientProfile/ClientProfileCard/ClientFeesCard";
import { ClientProfileCard } from "@/components/clientProfile/ClientProfileCard/ClientProfileCard";
import ClientStatusCard from "@/components/clientProfile/ClientProfileCard/ClientStatusCard";
import { FloatingDockClient } from "@/components/clientProfile/FloatingDock";
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
    <main className=" relative flex h-full min-h-screen w-full flex-col items-center  ">
      <div className="flex w-full rounded-lg px-2 py-4 dark:bg-dark-100 justify-between">
        <ClientProfileCard client={JSON.parse(JSON.stringify(client))} />
        <div className="flex flex-row items-center gap-4">
          <ClientStatusCard client={JSON.parse(JSON.stringify(client))} />
          <ClientFeesCard client={JSON.parse(JSON.stringify(client))} />
        </div>
      </div>
      <div className="flex h-full  min-h-[80vh] w-full">{children}</div>

      <FloatingDockClient id={id} />
    </main>
  );
}
