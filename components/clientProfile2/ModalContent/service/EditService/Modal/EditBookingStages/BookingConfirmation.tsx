"use client";

import React from "react";
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
} from "@heroui/react";
import { AlertTriangle, ArrowLeft, MapPin, Phone } from "lucide-react";
import { calculateTotalPrice } from "@/lib/utils";
import { ObjectId } from "mongoose";

// Component Interfaces
interface Dog {
  dogId: any;
  dogName: string;
  roomId: any;
  roomName: string;
}

interface Room {
  id: string;
  name: string;
  capacity: number;
}

interface BookingDetails {
  arrivalDate: Date;
  departureDate: Date;
  extraDay: boolean;
  petTaxiArrival: boolean;
  petTaxiDeparture: boolean;
  bookingFee: number;
  transportFee: number;
}

interface Client {
  id: ObjectId;
  name: string;
  avatar: string;
  location: string;
  phone: string;
}

interface BookingConfirmationProps {
  client: Client;
  dogs: Dog[];
  rooms: Room[];
  bookingDetails: BookingDetails;
  onBack: () => void;
  onConfirm: () => void;
}

export default function BookingConfirmation({
  client,
  dogs,
  rooms,
  bookingDetails,
  onBack,
  onConfirm,
}: BookingConfirmationProps) {
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

  const roomOccupancy: Record<string, number> = {};
  dogs.forEach((dog) => {
    if (dog.roomId) {
      roomOccupancy[dog.roomId] = (roomOccupancy[dog.roomId] || 0) + 1;
    }
  });

  const hasCapacityIssue = rooms.some(
    (room) => roomOccupancy[room.id] > room.capacity
  );

  const getRoomById = (roomId: string) =>
    rooms.find((room) => room.id === roomId);

  const totalBookingFee = calculateTotalPrice({
    fromDate: bookingDetails.arrivalDate,
    toDate: bookingDetails.departureDate,
    dailyPrice: bookingDetails.bookingFee,
    extraDay: bookingDetails.extraDay,
  });

  const transportTotal =
    (bookingDetails.petTaxiArrival ? bookingDetails.transportFee : 0) +
    (bookingDetails.petTaxiDeparture ? bookingDetails.transportFee : 0);

  const grandTotal = totalBookingFee + transportTotal;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
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
              <AvatarImage src={client.avatar} />
              <AvatarFallback>{client.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{client.name}</h3>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin size={16} /> {client.location}
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Phone size={16} /> {client.phone}
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
          <Table shadow="md">
            <TableHeader>
              <TableColumn>Περιγραφή</TableColumn>
              <TableColumn>Λεπτομέρειες</TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Άφιξη</TableCell>
                <TableCell>{formatDate(bookingDetails.arrivalDate)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Αναχώρηση</TableCell>
                <TableCell>
                  {formatDate(bookingDetails.departureDate)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Επιπλέον Ημέρα</TableCell>
                <TableCell>
                  {bookingDetails.extraDay ? (
                    <Chip color="success">Ναι</Chip>
                  ) : (
                    <Chip color="danger">Όχι</Chip>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Pet Taxi (Άφιξη)</TableCell>
                <TableCell>
                  {bookingDetails.petTaxiArrival ? (
                    <Chip color="success">Ναι</Chip>
                  ) : (
                    <Chip color="danger">Όχι</Chip>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Pet Taxi (Αναχώρηση)</TableCell>
                <TableCell>
                  {bookingDetails.petTaxiDeparture ? (
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
          {hasCapacityIssue && (
            <div className="mb-3 flex items-center gap-2 rounded-md bg-red-100 p-2 text-red-600">
              <AlertTriangle size={16} /> Υπέρβαση χωρητικότητας δωματίου!
            </div>
          )}
          <Table shadow="md" classNames={{ td: "text-base" }}>
            <TableHeader>
              <TableColumn>Σκύλος</TableColumn>
              <TableColumn>Δωμάτιο</TableColumn>
            </TableHeader>
            <TableBody>
              {dogs.map((dog) => {
                const room = getRoomById(dog.roomId);

                return (
                  <TableRow key={dog.dogId}>
                    <TableCell>{dog.dogName}</TableCell>
                    <TableCell>{room?.name || "Μη ανατεθειμένο"}</TableCell>
                  </TableRow>
                );
              }) || null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="ghost" color="danger" onPress={onBack}>
          <ArrowLeft size={16} /> ΕΠΙΣΤΡΟΦΗ
        </Button>
        <Button variant="ghost" color="success" onPress={onConfirm}>
          ΕΠΙΒΕΒΑΙΩΣΗ & ΚΑΤΑΧΩΡΗΣΗ
        </Button>
      </div>
    </div>
  );
}
