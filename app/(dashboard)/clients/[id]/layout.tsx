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
    <main className=" relative flex min-h-screen w-full flex-col items-center  ">
      <div className=" w-full rounded-lg px-2 py-4 dark:bg-dark-100">
        <ClientProfileCard client={JSON.parse(JSON.stringify(client))} />
      </div>
      <div className="flex min-h-[80vh] w-full">{children}</div>

      <FloatingDockClient id={id} />
    </main>
  );
}
