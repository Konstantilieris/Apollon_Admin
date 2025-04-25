import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Skeleton,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { formatDate } from "date-fns";
import { getBookingById } from "@/lib/actions/booking.action";
import { getBookingServices } from "@/lib/actions/service.action";
import { el } from "date-fns/locale";
import { getDurationDays } from "@/lib/utils";
interface Dog {
  dogName: string;
  roomName: string;
  dogId: string;
  roomId: string;
}

interface Client {
  clientName: string;
  phone: string;
  location: string;
  transportFee: number;
  bookingFee: number;
}

interface Booking {
  flag1: boolean;
  flag2: boolean;
  client: Client;
  fromDate: string;
  toDate: string;
  hasExtraDay: boolean;
  dogs: Dog[];
  totalAmount: number;
}

const ViewBookingContent = ({ bookingId }: { bookingId: string }) => {
  const [services, setServices] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [booking, setBooking] = React.useState<Booking | null>(null);

  React.useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      try {
        const res = await getBookingById(bookingId);
        const result = await getBookingServices({ bookingId });
        const data = JSON.parse(res);
        const resultedServices = JSON.parse(result);
        setServices(resultedServices);
        setBooking(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const formatCurrency = (amount: number) => `€${amount?.toFixed(2)}`;

  if (!booking) return null;

  return (
    <Skeleton
      isLoaded={!loading}
      className="mx-auto mt-12 w-full max-w-[1400px] p-8"
    >
      <div className="space-y-6">
        {/* Booking Header Card */}
        <Card className="border-none bg-gradient-to-r from-primary-500/10 to-primary-500/5">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className=" text-2xl font-semibold tracking-widest">
                Πληροφορίες Κράτησης
              </h2>
              <p className="text-default-500">
                {formatDate(booking.fromDate, "PPP", { locale: el })} -{" "}
                {formatDate(booking.toDate, "PPP", { locale: el })}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {booking.flag1 && (
                <Chip
                  startContent={<Icon icon="lucide:car" className="text-lg" />}
                  variant="flat"
                  color="success"
                  size="lg"
                >
                  PetTaxi άφιξη
                </Chip>
              )}
              {booking.flag2 && (
                <Chip
                  startContent={<Icon icon="lucide:car" className="text-lg" />}
                  variant="flat"
                  color="success"
                  size="lg"
                >
                  PetTaxi αναχώρηση
                </Chip>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-12">
          {/* Client Info Section */}
          <Card className="md:col-span-4">
            <CardHeader>
              <h3 className="text-lg font-semibold tracking-wide text-default-600">
                ΠΛΗΡΟΦΟΡΕΙΕΣ ΠΕΛΑΤΗ
              </h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar
                  name={booking.client.clientName}
                  size="lg"
                  className="h-16 w-16"
                />
                <div>
                  <p className="text-xl font-semibold">
                    {booking.client.clientName}
                  </p>
                  <p className="text-default-500">{booking.client.phone}</p>
                </div>
              </div>
              <Divider />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:map-pin" className="text-default-500" />
                  <span>{booking.client.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon
                    icon="lucide:credit-card"
                    className="text-default-500"
                  />
                  <span>
                    Μεταφορά: {formatCurrency(booking.client.transportFee)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:calendar" className="text-default-500" />
                  <span>
                    Ημερήσιο: {formatCurrency(booking.client.bookingFee)}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Pets Section */}
          <Card className="md:col-span-8">
            <CardHeader>
              <h3 className="text-lg font-semibold tracking-wide text-default-600">
                Κατοικίδια
              </h3>
            </CardHeader>
            <CardBody>
              <div className="grid gap-4 sm:grid-cols-2">
                {booking.dogs.map((dog: Dog, index: number) => (
                  <Card
                    key={index}
                    className="border-2 border-default-200 bg-default-50"
                  >
                    <CardBody className="flex items-center gap-4">
                      <div className="rounded-full bg-primary-100 p-3">
                        <Icon
                          icon="lucide:dog"
                          className="text-2xl text-primary-500"
                        />
                      </div>
                      <div className="flex grow flex-col items-center gap-2">
                        <p className="text-lg font-medium">{dog.dogName}</p>
                        <Chip size="md" variant="flat" color="secondary">
                          {dog.roomName}
                        </Chip>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Services Table */}
        <Card>
          <CardHeader>
            <div className="flex w-full items-center justify-between">
              <h3 className="text-lg font-semibold tracking-wide text-default-600">
                Υπηρεσίες
              </h3>
              <div className="text-right">
                <p className="text-sm text-default-500">Συνολικό</p>
                <p className="text-xl font-semibold text-light-900">
                  {formatCurrency(booking.totalAmount)}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <Table
              aria-label="Services table"
              removeWrapper
              classNames={{
                th: "text-base",
                td: "text-base",
              }}
            >
              <TableHeader>
                <TableColumn>ΤΥΠΟΣ</TableColumn>
                <TableColumn>ΗΜΕΡΟΜΗΝΙΑ</TableColumn>
                <TableColumn>ΔΙΑΡΚΕΙΑ</TableColumn>
                <TableColumn>ΠΟΣΟ</TableColumn>
                <TableColumn>ΦΠΑ</TableColumn>
                <TableColumn>ΣΥΝΟΛΟ</TableColumn>
                <TableColumn>ΠΛΗΡΩΘΗΚΕ</TableColumn>
                <TableColumn>ΚΑΤΑΣΤΑΣΗ</TableColumn>
              </TableHeader>
              <TableBody>
                {services.map((service: any, index) => (
                  <TableRow key={index}>
                    <TableCell>{service.serviceType}</TableCell>
                    <TableCell>
                      {formatDate(service.date, "PP", { locale: el })}
                      {service.serviceType === "ΔΙΑΜΟΝΗ" && (
                        <span className="text-default-500">
                          {" "}
                          - {formatDate(service.endDate, "PP", { locale: el })}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="pl-12 font-medium">
                      {service.serviceType === "ΔΙΑΜΟΝΗ" ? (
                        <div className="flex flex-row items-center gap-2 ">
                          {" "}
                          {getDurationDays(service.date, service.endDate)}
                          {service.bookingId.extraDay ? (
                            <span className="text-green-400 ">+ 1</span>
                          ) : (
                            ""
                          )}
                        </div>
                      ) : (
                        0
                      )}
                    </TableCell>
                    <TableCell>{formatCurrency(service.amount)}</TableCell>
                    <TableCell>{formatCurrency(service.taxAmount)}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(service.totalAmount)}
                    </TableCell>
                    <TableCell>{formatCurrency(service.paidAmount)}</TableCell>
                    <TableCell>
                      <Chip
                        size="md"
                        className="flex items-center p-1 text-base"
                        variant="flat"
                        color={service.paid ? "success" : "warning"}
                        startContent={
                          <Icon
                            icon={
                              service.paid ? "lucide:check" : "lucide:clock"
                            }
                          />
                        }
                      >
                        {service.paid ? "Πληρώθηκε" : "Εκκρεμεί"}
                      </Chip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </Skeleton>
  );
};

export default ViewBookingContent;
