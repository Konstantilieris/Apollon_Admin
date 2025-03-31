// OtherServiceFees.tsx
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

export function OtherServiceFees() {
  const { otherServiceFees, setOtherServiceFee } = useServiceFeesStore(
    (state) => ({
      otherServiceFees: state.otherServiceFees,
      setOtherServiceFee: state.setOtherServiceFee,
    })
  );

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Λοιπές Υπηρεσίες</h3>
      </CardHeader>
      <CardBody>
        <Table
          aria-label="Other service fees"
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
            {otherServiceFees.map((fee, index) => (
              <TableRow key={index}>
                <TableCell>{fee.type}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={fee.value.toString()}
                    onValueChange={(val) => {
                      const num = parseFloat(val) || 0;
                      setOtherServiceFee(fee.type, num);
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
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
