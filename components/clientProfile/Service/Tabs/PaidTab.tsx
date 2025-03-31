import {
  TableHeader,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";

import React from "react";
import { Service } from "./OwesTab";

import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenuActionPaid } from "../ActionServices/PaidActionCommand";
import moment from "moment";

const PaidTab = ({ services }: any) => {
  const [selectedServices, setSelectedServices] = React.useState<Service[]>([]);
  const [totalSelectedAmount, setTotalSelectedAmount] = React.useState(0);
  const isServiceSelected = (serviceId: string) =>
    selectedServices.some(
      (selectedService) => selectedService._id === serviceId
    );
  const handleCheckboxChange = (service: Service, isChecked: boolean) => {
    if (isChecked) {
      // Add the entire service object to selectedServices array
      setSelectedServices((prevSelected) => [...prevSelected, service]);
      setTotalSelectedAmount((prevAmount) => prevAmount + service.amount);
    } else {
      // Remove the service from the selectedServices array based on its ID
      setSelectedServices((prevSelected) =>
        prevSelected.filter(
          (selectedService) => selectedService._id !== service._id
        )
      );
      setTotalSelectedAmount((prevAmount) => prevAmount - service.amount);
    }
  };

  return (
    <div className=" ml-8 min-h-[70vh] overflow-x-auto">
      <div className="mb-1 flex w-full flex-row text-lg">
        <p className="font-medium ">
          Σύνολο:{" "}
          <span className="text-blue-500"> {totalSelectedAmount} €</span>{" "}
        </p>
      </div>
      <Table className="min-w-full rounded-xl border border-none border-gray-200 shadow-md ">
        <TableHeader className="">
          <TableRow className=" bg-dark-400  text-left">
            <TableHead className="px-4 py-3 font-semibold text-light-900">
              Υπηρεσία
            </TableHead>
            <TableHead className="px-4 py-3 font-semibold text-light-900">
              Σημειώση
            </TableHead>
            <TableHead className="px-4 py-3 font-semibold text-light-900">
              Ημερομηνία
            </TableHead>
            <TableHead className="px-4 py-3 font-semibold text-light-900">
              Διάρκεια
            </TableHead>

            <TableHead className="px-4 py-3 text-center font-semibold text-light-900">
              Ημερομηνία Πληρωμής
            </TableHead>
            <TableHead className="px-4 py-3 font-semibold text-light-900">
              Σύνολο
            </TableHead>
            <TableHead className="flex h-full w-full justify-end px-2 py-3 pb-2 font-semibold text-light-900">
              <DropdownMenuActionPaid selectedServices={selectedServices} />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service: any, index: number) => {
            let serviceType = service.serviceType;
            if (serviceType === "Pet Taxi (Drop-Off)") {
              serviceType = "Pet Taxi (ΠΑΡΑΔΟΣΗ)";
            } else if (serviceType === "Pet Taxi (Pick-Up)") {
              serviceType = "Pet Taxi (ΠΑΡΑΛΑΒΗ)";
            }
            const start = moment(service.date);
            const end = moment(service.endDate);

            return (
              <TableRow key={service._id} className="bg-dark-300 text-left">
                <TableCell className="px-4 py-3">{serviceType}</TableCell>
                <TableCell className="px-4 py-3">{service.notes}</TableCell>

                <TableCell className="px-4 py-3">
                  {" "}
                  {new Date(service.date).toLocaleDateString("el-GR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                  -{" "}
                  {new Date(service.endDate).toLocaleDateString("el-GR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="px-4 py-3">
                  {end.diff(start, "days")} ημέρες
                </TableCell>
                <TableCell className=" text-center">
                  {service.paymentDate
                    ? new Date(service.paymentDate).toLocaleDateString(
                        "el-GR",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )
                    : "-"}
                </TableCell>
                <TableCell className="px-4  pl-6 ">
                  {service.amount} €{" "}
                </TableCell>
                <TableCell className=" mr-6 flex flex-row justify-end">
                  <Checkbox
                    id={`checkbox-${service._id}`}
                    checked={isServiceSelected(service._id)}
                    onCheckedChange={(checked: boolean | string) =>
                      handleCheckboxChange(service, checked === true)
                    }
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <span className="ml-4 text-sm text-gray-400">
        {selectedServices.length} από {services.length} επιλεγμένες υπηρεσίες
      </span>
    </div>
  );
};

export default PaidTab;
