// TransportationFee.tsx
import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Input,
} from "@heroui/react";
import { useServiceFeesStore } from "@/hooks/serviceFees.store";

export function TransportationFees() {
  const { transportationFees, setTransportationFee } = useServiceFeesStore(
    (state) => ({
      transportationFees: state.transportationFees,
      setTransportationFee: state.setTransportationFee,
    })
  );
  console.log("TransportationFees", transportationFees);
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Χρέωση Μεταφοράς</h3>
      </CardHeader>
      <CardBody>
        <Table
          aria-label="Transportation fees"
          removeWrapper
          className="max-w-4xl px-2"
          classNames={{
            td: "text-base",
            th: "text-base",
          }}
        >
          <TableHeader>
            <TableColumn>ΥΠΗΡΕΣΙΑ</TableColumn>
            <TableColumn align="end">ΧΡΕΩΣΗ</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>PET TAXI</TableCell>
              <TableCell>
                <Input
                  type="number"
                  min={0}
                  value={transportationFees?.value?.toString()}
                  onValueChange={(val) => {
                    const num = parseFloat(val) || 0;
                    setTransportationFee(
                      transportationFees?.type ?? "transportFee",
                      num
                    );
                  }}
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-small text-default-400">€</span>
                    </div>
                  }
                  className="ml-auto max-w-[150px]"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
