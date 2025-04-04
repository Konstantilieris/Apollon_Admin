import React from "react";
import { Card, CardBody, CardHeader, Link } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Client } from "@/types";

interface ClientInfoProps {
  client: Client;
}

export function ClientInfo({ client }: ClientInfoProps) {
  return (
    <Card>
      <CardHeader className="flex gap-3">
        <Icon icon="lucide:user" className="text-2xl text-default-500" />
        <div className="flex flex-col">
          <p className="text-md">Πληροφορίες Πελάτη</p>
          <p className="text-small text-default-500">ID: {client._id}</p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-2">
          <div>
            <p className="text-small text-default-500">Όνομα</p>
            <Link href={`/clients/${client._id}`} color="primary">
              {client.name}
            </Link>
          </div>
          {client.email && (
            <div>
              <p className="text-small text-default-500">Email</p>
              <p className="text-medium">{client.email}</p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
