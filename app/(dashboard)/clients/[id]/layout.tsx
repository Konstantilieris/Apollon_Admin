import { ClientProfileCard } from "@/components/clientProfile/ClientProfileCard";
import { FloatingDockClient } from "@/components/clientProfile/FloatingDock";
import { getClientById } from "@/lib/actions/client.action";
import React from "react";
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const { id } = params;

  const client = await getClientById(id);
  if (!client) {
    return <div>No client Found</div>;
  }
  return (
    <main className=" custom-scrollbar relative flex h-full  w-full flex-col items-center  overflow-y-scroll p-4">
      <ClientProfileCard client={JSON.parse(JSON.stringify(client))} />
      <section className=" h-full w-full ">{children}</section>

      <FloatingDockClient id={id} />
    </main>
  );
}
