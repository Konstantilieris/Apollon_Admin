import React from "react";
import { Card, CardHeader, CardBody, Avatar, Badge, Chip } from "@heroui/react";
import { getClientByIdForProfile } from "@/lib/actions/client.action";
import { IClient } from "@/database/models/client.model";
import ModalClientProvider from "@/components/clientProfile2/ModalContent/ModalClientProvider";
import TagManager from "@/components/clientProfile2/Tags/TagManager";

type Client = IClient;
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const { id } = params;

  const client: Client = await getClientByIdForProfile(id);
  if (!client) {
    return <div>No client Found</div>;
  }

  return (
    <div className="h-full w-full ">
      <ModalClientProvider />
      <main className=" relative flex  h-full  w-full flex-col  items-center">
        <div className="flex h-full  w-full items-start justify-center">
          <Card className=" w-full ">
            <CardHeader className="relative flex h-[100px] flex-col justify-end overflow-visible bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400">
              <Badge
                classNames={{
                  badge:
                    "ring-1 ring-dark-600 border-0 text-light-900 bg-dark-200",
                }}
                content={client?.dog?.length}
                className="translate-x-0 translate-y-12"
              >
                <Avatar
                  className="h-20 w-20  translate-y-12"
                  src="https://i.pravatar.cc/150?u=a04258114e29026708c"
                />
              </Badge>
              <Chip
                className="absolute right-3 top-3  text-white dark:bg-dark-100"
                radius="full"
                size="lg"
                variant="light"
              >
                {client?.owesTotal?.toFixed(2)} €
              </Chip>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col items-center pb-4 pt-6">
                <p className="text-large font-medium">{client?.name}</p>

                <p className="text-small text-default-400">
                  {client?.profession}
                </p>
                <p className="max-w-[90%] text-small text-default-400">
                  {client?.email}
                </p>
                <TagManager tags={client?.tags} id={client._id} />
                <p className="py-2 text-small text-foreground">
                  ΣΥΣΤΑΣΗ ΑΠΟ: {client.references?.isReferenced?.client?.name}
                </p>
                <div className="flex gap-2">
                  <p>
                    <span className="text-small font-medium text-default-500">
                      {client?.owesTotal?.toFixed(2) ?? "0.00"} €
                    </span>
                    &nbsp;
                    <span className="text-small tracking-widest text-default-400">
                      Οφειλές
                    </span>
                  </p>
                  <p>
                    <span className="text-small font-medium text-default-500">
                      {client.totalSpent?.toFixed(2) ?? "0.00"} €
                    </span>
                    &nbsp;
                    <span className="text-small tracking-widest text-default-400">
                      Πληρωμένα
                    </span>
                  </p>
                </div>
              </div>
              {children}
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
}
