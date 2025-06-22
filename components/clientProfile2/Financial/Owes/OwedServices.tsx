import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Selection,
  Skeleton,
  Chip,
} from "@heroui/react";
import { Icon } from "@iconify/react";

import type { SortDescriptor } from "@react-types/shared";

import { Service } from "@/types";

import { ServicesSummary } from "./OwesSummary";
import { getUnpaidClientServices } from "@/lib/actions/service.action";
import { useModalStore } from "@/hooks/client-profile-store";
import { getDurationDays } from "@/lib/utils";
import renderServiceTypeChip from "./ServiceType";

interface ServicesListProps {
  client: any;
}

export default function ServicesList({ client }: ServicesListProps) {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 5;

  const [loading, setLoading] = React.useState(true);
  const [services, setServices] = React.useState<Service[]>([]);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "date",
    direction: "descending",
  });
  const [filteredServices, setFilteredServices] = React.useState(services);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const { openModal } = useModalStore();
  const selectedCount = React.useMemo(() => {
    if (selectedKeys === "all") return filteredServices.length;
    return selectedKeys instanceof Set ? selectedKeys.size : 0;
  }, [selectedKeys, filteredServices]);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        // Call your API route
        const res = await getUnpaidClientServices({ clientId: client._id });
        setServices(res);
        setFilteredServices(res);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [client]);

  const handleBulkAction = (action: string) => {
    const selectedServices =
      selectedKeys === "all"
        ? filteredServices
        : filteredServices.filter(
            (service: any) =>
              selectedKeys instanceof Set && selectedKeys.has(service._id)
          );

    switch (action) {
      case "export":
        openModal("fullPayServices", {
          client,
          selectedServices,
        });
        break;
      case "partialPay":
        openModal("partialPayService", {
          client,
          selectedServices,
        });
        break;
      case "discount":
        openModal("discountService", {
          client,
          selectedServices,
        });
        break;
      case "print":
        console.log("Printing", selectedServices);
        break;

      case "delete":
        openModal("deleteServices", {
          client,
          selectedServices,
        });
        break;
    }
  };

  const pages = Math.ceil(services.length / rowsPerPage);
  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const paginatedServices = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredServices.slice(start, end);
  }, [page, filteredServices]);
  const sortedServices = React.useMemo(() => {
    return [...paginatedServices].sort((a: Service, b: Service) => {
      const first = a[sortDescriptor.column as keyof Service] as number;
      const second = b[sortDescriptor.column as keyof Service] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, paginatedServices]);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };
  const selectedTotals = React.useMemo(() => {
    const selectedServices =
      selectedKeys === "all"
        ? filteredServices
        : filteredServices.filter(
            (service: any) =>
              selectedKeys instanceof Set && selectedKeys.has(service._id)
          );

    const totalRemaining = selectedServices.reduce(
      (sum, s) => sum + (s.remainingAmount || 0),
      0
    );
    const totalFinal = selectedServices.reduce(
      (sum, s) => sum + (s.totalAmount || 0),
      0
    );

    return {
      remaining: totalRemaining,
      final: totalFinal,
    };
  }, [selectedKeys, filteredServices]);
  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex items-center justify-between p-2">
        <div>
          <span className="w-[30%] text-base text-default-400">
            {selectedKeys === "all"
              ? "Όλες οι σειρές είναι επιλεγμένες"
              : `${selectedKeys?.size} απο ${filteredServices?.length} επιλέχθηκαν`}
          </span>
        </div>
        <Pagination
          isCompact
          showControls
          showShadow
          color="secondary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden w-[30%] justify-end gap-2 sm:flex">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Προηγούμενο
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Επόμενο
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, services?.length, page, pages]);
  const renderServiceType = (serviceType: string) => {
    switch (serviceType) {
      case "Pet Taxi (Drop-Off)":
        return "Μεταφορά Κατοικιδίου (Αποστολή)";
      case "Pet Taxi (Pick-Up)":
        return "Μεταφορά Κατοικιδίου (Παραλαβή)";
      default:
        return serviceType;
    }
  };

  return (
    <Card className="m-0 h-full w-full">
      <CardBody className="h-full w-full overflow-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Υπηρεσίες</h2>
            <p className="mt-2 text-sm tracking-widest text-gray-500">
              Σύνοψη Υπηρεσιών προς Πληρωμή
            </p>
          </div>

          {selectedCount > 0 && (
            <Dropdown backdrop="blur" placement="bottom-end" closeOnSelect>
              <DropdownTrigger>
                <Button
                  color="secondary"
                  className="tracking-widest"
                  variant="flat"
                  startContent={
                    <Icon icon="lucide:check-square" className="h-4 w-4" />
                  }
                >
                  {selectedCount} Επιλεγμένες
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                className="flex min-h-[20vh] w-80 justify-items-center font-sans "
                classNames={{
                  base: "bg-neutral-900",
                }}
              >
                <DropdownItem
                  key="export"
                  onPress={() => handleBulkAction("export")}
                  startContent={
                    <Icon
                      icon="lucide:file-check"
                      className="h-8 w-8 text-success-600"
                    />
                  }
                  classNames={{
                    base: "text-lg",
                    title: "text-lg",
                    description: "text-lg",
                  }}
                >
                  Εξόφληση Επιλεγμένων
                </DropdownItem>
                <DropdownItem
                  key="partialPay"
                  onPress={() => handleBulkAction("partialPay")}
                  startContent={
                    <Icon
                      icon="lucide:credit-card"
                      className="h-8 w-8 text-warning-600"
                    />
                  }
                  classNames={{
                    base: "text-lg",
                    title: "text-lg",
                    description: "text-lg",
                  }}
                >
                  Έναντι Πληρωμή Επιλεγμένων
                </DropdownItem>
                <DropdownItem
                  key="discount"
                  onPress={() => handleBulkAction("discount")}
                  startContent={
                    <Icon
                      icon="lucide:percent"
                      className="h-8 w-8 text-primary-500"
                    />
                  }
                  classNames={{
                    base: "text-lg",
                    title: "text-lg",
                    description: "text-lg",
                  }}
                >
                  Έκπτωση Επιλεγμένων
                </DropdownItem>

                <DropdownItem
                  key="print"
                  onPress={() => handleBulkAction("print")}
                  startContent={
                    <Icon icon="lucide:printer" className="h-8 w-8" />
                  }
                  classNames={{
                    base: "text-lg",
                    title: "text-lg",
                    description: "text-lg",
                  }}
                >
                  Εκτύπωση Επιλεγμένων
                </DropdownItem>

                <DropdownItem
                  key="delete"
                  color="danger"
                  onPress={() => handleBulkAction("delete")}
                  startContent={
                    <Icon
                      icon="lucide:trash-2"
                      className="h-8 w-8 text-danger-500"
                    />
                  }
                  classNames={{
                    base: "text-lg",
                    title: "text-lg",
                    description: "text-lg",
                  }}
                >
                  Διαγραφή Επιλεγμένων
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
          <div className="flex flex-row items-center gap-2">
            {selectedCount > 0 && (
              <div className=" flex gap-4 max-lg:hidden">
                <Chip
                  color="warning"
                  variant="flat"
                  className="p-4 text-base tracking-widest"
                  startContent={<Icon icon="lucide:wallet" width={18} />}
                >
                  Υπόλοιπο Επιλεγμένων:{" "}
                  {formatCurrency(selectedTotals.remaining)}
                </Chip>
                <Chip
                  color="success"
                  variant="flat"
                  className="p-4 text-base tracking-widest"
                  startContent={<Icon icon="lucide:euro" width={18} />}
                >
                  Τελικό Ποσό Επιλεγμένων:{" "}
                  {formatCurrency(selectedTotals.final)}
                </Chip>
              </div>
            )}
            <Button
              color="default"
              variant="ghost"
              startContent={
                <Icon icon="lucide:calendar-plus" className="h-4 w-4" />
              }
              onPress={() => openModal("extraCalendarServices", { client })}
            >
              Δημιουργία Εκπαίδευσης / Φροντίδας
            </Button>
            <Button
              color="default"
              variant="ghost"
              startContent={<Icon icon="lucide:plus" className="h-4 w-4" />}
              className="tracking-wide "
              onPress={() => openModal("createService", { client })}
            >
              Δημιουργία Υπηρεσίας
            </Button>
          </div>
        </div>
        <Skeleton isLoaded={!loading}>
          <ServicesSummary services={filteredServices} />

          <Table
            aria-label="Services and payments table"
            shadow="sm"
            isStriped
            className="mt-4 h-full min-w-full"
            classNames={{
              th: "text-base",
              td: "text-base",
            }}
            removeWrapper
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            color="secondary"
            onSelectionChange={setSelectedKeys}
            bottomContent={bottomContent}
            onSortChange={setSortDescriptor}
            sortDescriptor={sortDescriptor}
          >
            <TableHeader>
              <TableColumn>Υπηρεσία</TableColumn>
              <TableColumn allowsSorting key={"date"}>
                Ημερομηνία
              </TableColumn>
              <TableColumn>Διάρκεια Υπ.</TableColumn>
              <TableColumn>Αρχ. Ποσό</TableColumn>
              <TableColumn>Φ.Π.Α</TableColumn>
              <TableColumn>Τελ. Ποσό</TableColumn>
              <TableColumn>Πληρωμένο</TableColumn>
              <TableColumn>Υπόλοιπο</TableColumn>
              <TableColumn>Έκπτωση</TableColumn>
              <TableColumn>Σημειώσεις</TableColumn>
              <TableColumn>ΕΝΕΡΓΕΙΕΣ</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No services found"}>
              {sortedServices.map((service: any) => (
                <TableRow key={service._id}>
                  <TableCell className="font-medium">
                    {renderServiceType(service.serviceType)}
                  </TableCell>
                  <TableCell>{renderServiceTypeChip(service)}</TableCell>
                  <TableCell className="pl-12 font-medium">
                    {service?.serviceType === "ΔΙΑΜΟΝΗ" ? (
                      <div className="flex flex-row items-center gap-2 ">
                        {" "}
                        {getDurationDays(service.date, service.endDate)}
                        {service?.bookingId?.extraDay ? (
                          <span className="text-green-400 ">+ 1</span>
                        ) : (
                          ""
                        )}
                      </div>
                    ) : (
                      0
                    )}
                  </TableCell>
                  <TableCell>{formatCurrency(service?.amount)}</TableCell>
                  <TableCell>{formatCurrency(service?.taxAmount)}</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(service?.totalAmount)}
                  </TableCell>
                  <TableCell className="text-success-600">
                    {formatCurrency(service?.paidAmount)}
                  </TableCell>
                  <TableCell className="text-warning-600">
                    {formatCurrency(service?.remainingAmount)}
                  </TableCell>
                  <TableCell>{formatCurrency(service?.discount)}</TableCell>
                  <TableCell>{service?.notes}</TableCell>
                  <TableCell>
                    <Dropdown
                      backdrop="blur"
                      classNames={{
                        trigger: "text-light-900",
                        content: "bg-neutral-900",
                      }}
                    >
                      <DropdownTrigger>
                        <Button isIconOnly variant="light" size="sm">
                          <Icon
                            icon="lucide:more-horizontal"
                            className="h-4 w-4"
                          />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu className="flex w-80">
                        <DropdownItem
                          key={"view"}
                          classNames={{
                            title:
                              "flex flex-row items-center text-lg font-sans tracking-wide",
                          }}
                          onPress={() => {
                            openModal("serviceView", {
                              serviceId: service?._id,
                            });
                          }}
                        >
                          <Icon icon="lucide:eye" className="mr-2 h-8 w-8" />
                          Προβολή Λεπτομερειών
                        </DropdownItem>
                        <DropdownItem
                          key={"edit"}
                          onPress={() => {
                            openModal("editService", { service, client });
                          }}
                          classNames={{
                            title:
                              "flex flex-row items-center text-lg font-sans tracking-wide",
                          }}
                        >
                          <Icon icon="lucide:pencil" className="mr-2 h-8 w-8" />
                          Επεξεργασία
                        </DropdownItem>
                        <DropdownItem
                          key={"Tax"}
                          className="flex flex-row gap-2 text-warning"
                          classNames={{
                            title:
                              "flex flex-row items-center font-sans text-lg tracking-wide",
                          }}
                          onPress={() => {
                            openModal("taxService", { service });
                          }}
                        >
                          <Icon
                            icon="lucide:percent"
                            className="mr-2 h-6 w-6 text-warning"
                          />
                          Εφαρμογή Φόρου
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex justify-center"></div>
        </Skeleton>
      </CardBody>
    </Card>
  );
}
