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
  Badge,
} from "@heroui/react";

export function FinancialSummary({ client }: { client: any }) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Οικονομική Σύνοψη</h3>
      </CardHeader>
      <CardBody>
        <Table
          aria-label="Financial summary"
          removeWrapper
          className="max-w-4xl px-2"
          classNames={{
            td: "text-base",
            th: "text-base",
          }}
        >
          <TableHeader>
            <TableColumn>ΜΕΤΡΙΚΟ</TableColumn>
            <TableColumn align="end">ΑΞΙΑ</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Σύνολο Δαπανών</TableCell>
              <TableCell className="text-right">€{client.totalSpent}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Οφειλές</TableCell>
              <TableCell className="text-right">€{client.owesTotal}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Πίστωση</TableCell>
              <TableCell className="text-right">€{client.credit}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Pόντοι Επιβράβευσης</TableCell>
              <TableCell className="text-right">{client.points}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Επίπεδο Επιβράβευσης</TableCell>
              <TableCell className="text-right">
                <Badge color="primary">{client.loyaltyLevel}</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
