"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Badge,
} from "@heroui/react";
import { ArrowLeft, MapPin, Phone } from "lucide-react";
import { calculateTotalPrice, getDurationDays } from "@/lib/utils";
import { toast } from "sonner";
import { useBookingStore } from "@/hooks/booking-store";

import { useRouter } from "next/navigation";

export default function ConfirmationStage({
  client,
  onBack,
  onNext,
  onReset,
}: any) {
  const {
    dateArrival,
    dateDeparture,
    dogsData,
    setBoardingPrice,
    setTransportationPrice,
    extraDay,
    taxiArrival,
    taxiDeparture,
    setExtraDayPrice,
    setClient,
    createBooking,
    resetStore,
  } = useBookingStore();
  const router = useRouter();

  /** ──────────────────────── memoised fee data ──────────────────── */
  const transportFee = useMemo<number>(() => {
    return (
      client?.serviceFees.find((fee: any) => fee.type === "transportFee")
        ?.value || 0
    );
  }, [client]);

  /** Boarding fees – just the bookingFee fees */
  const clientBoardingFees = useMemo<any[]>(() => {
    return (
      client?.serviceFees?.filter((fee: any) => fee.type === "bookingFee") || []
    );
  }, [client]);

  /** Map from dogCount → fee for O(1) look‑ups */
  const feeMap = useMemo<Record<number, any>>(() => {
    const map: Record<number, any> = {};
    clientBoardingFees.forEach((fee) => {
      if (typeof fee.dogCount === "number") {
        map[fee.dogCount] = fee;
      }
    });
    return map;
  }, [clientBoardingFees]);

  /** Selected booking fee defaults to fee that matches dog count, else first fee */
  const [selectedBookingFee, setSelectedBookingFee] = useState<any>(
    feeMap[dogsData.length] ?? clientBoardingFees[0] ?? null
  );

  /** ──────────────────────── prices & totals ────────────────────── */
  const [totalBookingFee, setTotalBookingFee] = useState(0);
  const transportTotal =
    (taxiArrival ? transportFee : 0) + (taxiDeparture ? transportFee : 0);

  useEffect(() => {
    setTransportationPrice(transportFee);
  }, [transportFee, setTransportationPrice]);

  /** Re‑calculate total whenever pricing inputs change */
  useEffect(() => {
    const totalPrice = calculateTotalPrice({
      fromDate: dateArrival ?? new Date(),
      toDate: dateDeparture ?? new Date(),
      dailyPrice: selectedBookingFee?.value ?? 0,
      extraDay,
    });
    setTotalBookingFee(totalPrice);
  }, [selectedBookingFee, dateArrival, dateDeparture, extraDay]);

  /** Push boarding price to global store */
  useEffect(() => {
    setBoardingPrice(totalBookingFee);
  }, [totalBookingFee, setBoardingPrice]);

  /** Sync client meta to store */
  useEffect(() => {
    const clientObject = {
      clientId: client._id,
      clientName: client.name,
      phone: client?.phone?.mobile?.trim()
        ? client.phone.mobile
        : client.phone?.telephone?.trim()
          ? client.phone.telephone
          : "Δεν έχει οριστεί",
      location: client?.location?.address?.trim()
        ? client.location.address
        : "Δεν έχει οριστεί",
      transportFee,
      bookingFee: selectedBookingFee?.value ?? 0,
    };
    setClient(clientObject);
  }, [client, selectedBookingFee, transportFee, setClient]);

  /** ────────────────────── helpers ──────────────────────────────── */
  const formatDate = (date: Date) =>
    date.toLocaleDateString("el-GR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }) +
    " " +
    date.toLocaleTimeString("el-GR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const topContent = useMemo(() => {
    return (
      <div className="mb-4 flex flex-wrap items-center gap-4 p-4">
        <h1 className="text-lg font-semibold tracking-wide">
          Επιλογή Ημερήσιας Χρέωσης:
        </h1>
        {dogsData.map((_, index) => {
          const dogNumber = index + 1;
          const serviceFee = feeMap[dogNumber];
          const key = serviceFee?._id ?? `dog-fee-${dogNumber}`;
          const isSelected = selectedBookingFee?._id === serviceFee?._id;
          return (
            <Badge
              key={key}
              content={`${dogNumber}`}
              color={isSelected ? "success" : "warning"}
              variant="faded"
              size="lg"
            >
              <Chip
                onClick={() => {
                  if (!serviceFee) return; // fee could be missing
                  setSelectedBookingFee(serviceFee);
                  if (extraDay) {
                    setExtraDayPrice(serviceFee?.value ?? 0);
                  }
                }}
                color={isSelected ? "success" : "default"}
                size="lg"
                className="cursor-pointer"
              >
                {serviceFee?.value ? `€${serviceFee.value}` : "Μη ανατεθειμένο"}
              </Chip>
            </Badge>
          );
        })}
      </div>
    );
  }, [dogsData, feeMap, selectedBookingFee, extraDay, setExtraDayPrice]);

  useEffect(() => {
    const totalPrice = calculateTotalPrice({
      fromDate: dateArrival ?? new Date(),
      toDate: dateDeparture ?? new Date(),
      dailyPrice: selectedBookingFee.value ?? clientBoardingFees[0]?.value,
      extraDay,
    });
    setTotalBookingFee(totalPrice);
  }, [selectedBookingFee]);
  useEffect(() => {
    setBoardingPrice(totalBookingFee);
  }, [totalBookingFee]);
  if (!dateArrival || !dateDeparture) return null;

  const location = client?.location?.address;

  const grandTotal = totalBookingFee + transportTotal;
  const handleBooking = async () => {
    try {
      await createBooking();
      toast.success("Η κράτηση ολοκληρώθηκε επιτυχώς.");
    } catch (error) {
      console.error(error);
      toast.error("Η κράτηση δεν ολοκληρώθηκε επιτυχώς.");
    } finally {
      onNext();
      resetStore();
      onReset();
      router.refresh();
    }
  };
  if (!dateArrival || !dateDeparture) return null;
  return (
    <div className="mx-auto max-h-[calc(100vh_-_400px)] max-w-4xl space-y-6 overflow-y-auto rounded-lg bg-neutral-950 p-4">
      {/* Client Info */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-2xl font-bold">
            Επιβεβαίωση Κράτησης & Δωματίων
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={"/placeholder.svg?height=40&width=40"} />
              <AvatarFallback>{client?.name?.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{client?.name}</h3>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin size={16} /> {location}
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Phone size={16} />{" "}
                {client?.phone.mobile
                  ? client?.phone.mobile
                  : client?.phone?.telephone
                    ? client?.phone?.telephone
                    : "Δεν έχει οριστεί"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <CardTitle>Στοιχεία Κράτησης</CardTitle>
        </CardHeader>
        <CardContent>
          <Table
            shadow="md"
            topContent={topContent}
            topContentPlacement="outside"
            classNames={{
              td: "text-lg",
              th: "text-lg",
            }}
          >
            <TableHeader>
              <TableColumn>Περιγραφή</TableColumn>
              <TableColumn>Λεπτομέρειες</TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Άφιξη</TableCell>
                <TableCell>{formatDate(dateArrival)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Αναχώρηση</TableCell>
                <TableCell>{formatDate(dateDeparture)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Διάρκεια</TableCell>
                <TableCell>
                  {getDurationDays(dateArrival, dateDeparture)} νύχτες
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Επιπλέον Ημέρα</TableCell>
                <TableCell>
                  {extraDay ? (
                    <Chip color="success">Ναι</Chip>
                  ) : (
                    <Chip color="danger">Όχι</Chip>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Pet Taxi (Παραλαβή)</TableCell>
                <TableCell>
                  {taxiArrival ? (
                    <Chip color="success">Ναι</Chip>
                  ) : (
                    <Chip color="danger">Όχι</Chip>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Pet Taxi (Παράδοση)</TableCell>
                <TableCell>
                  {taxiDeparture ? (
                    <Chip color="success">Ναι</Chip>
                  ) : (
                    <Chip color="danger">Όχι</Chip>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Κόστος Διαμονής</TableCell>
                <TableCell>€{totalBookingFee.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Κόστος Μεταφοράς</TableCell>
                <TableCell>€{transportTotal.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Σύνολο</TableCell>
                <TableCell className="font-bold">
                  €{grandTotal.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Room Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Ανάθεση Δωματίων</CardTitle>
        </CardHeader>
        <CardContent>
          <Table
            shadow="md"
            classNames={{
              td: "text-lg",
              th: "text-lg",
            }}
          >
            <TableHeader>
              <TableColumn>Σκύλος</TableColumn>
              <TableColumn>Δωμάτιο</TableColumn>
            </TableHeader>
            <TableBody>
              {dogsData.map((dog) => {
                return (
                  <TableRow key={dog.dogId}>
                    <TableCell>{dog.dogName}</TableCell>
                    <TableCell>{dog.roomName || "Μη ανατεθειμένο"}</TableCell>
                  </TableRow>
                );
              }) || null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pb-8">
        <Button variant="ghost" color="danger" onPress={onBack}>
          <ArrowLeft size={16} /> ΕΠΙΣΤΡΟΦΗ
        </Button>
        <Button variant="ghost" color="success" onPress={handleBooking}>
          ΕΠΙΒΕΒΑΙΩΣΗ & ΚΑΤΑΧΩΡΗΣΗ
        </Button>
      </div>
    </div>
  );
}
