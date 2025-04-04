import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Link,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { ServiceAllocation } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ServiceAllocationsProps {
  allocations: ServiceAllocation[];
}

export function ServiceAllocations({ allocations }: ServiceAllocationsProps) {
  if (allocations.length === 0) {
    return (
      <Card>
        <CardBody>
          <div className="py-6 text-center">
            <Icon
              icon="lucide:inbox"
              className="mx-auto mb-3 text-4xl text-default-400"
            />
            <p className="text-default-500">
              Δεν υπάρχουν κατανομές υπηρεσιών για αυτή την πληρωμή
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex gap-3">
        <Icon icon="lucide:list" className="text-2xl text-default-500" />
        <div className="flex flex-col">
          <p className="text-md">Κατανομές Υπηρεσιών</p>
          <p className="text-small text-default-500">
            {allocations.length} υπηρεσία{allocations.length !== 1 ? "ς" : ""}
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <Table removeWrapper aria-label="Κατανομές Υπηρεσιών">
          <TableHeader>
            <TableColumn>ΥΠΗΡΕΣΙΑ</TableColumn>
            <TableColumn>ΠΟΣΟ</TableColumn>
          </TableHeader>
          <TableBody>
            {allocations.map((allocation) => (
              <TableRow key={allocation.serviceId}>
                <TableCell>
                  <div className="flex flex-col">
                    <Link
                      href={`/services/${allocation.serviceId}`}
                      color="primary"
                    >
                      {allocation.serviceId}
                    </Link>
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(allocation.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
