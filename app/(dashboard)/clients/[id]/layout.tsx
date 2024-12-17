import { FloatingDockClient } from "@/components/clientProfile/FloatingDock";
import ClientRow from "@/components/clientProfile/Layout/ClientRow";
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
    <main className=" relative flex  h-full  w-full flex-col  items-center ">
      <ServiceModalProvider client={JSON.parse(JSON.stringify(client))} />
      <ClientRow id={id} />
      <>{children}</>

      <FloatingDockClient id={id} />
    </main>
  );
}
