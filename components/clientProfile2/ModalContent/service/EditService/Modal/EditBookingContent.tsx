"use client";

import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import useEditBookingStore from "@/hooks/editBooking-store";
import {
  getBookingById,
  updateBookingAllInclusive,
} from "@/lib/actions/booking.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useModalStore } from "@/hooks/client-profile-store";
import { Skeleton } from "@heroui/react";

// Dynamic imports for lazy-loading
const BookingFirstStage = dynamic(
  () => import("./EditBookingStages/BookingFirstStage"),
  {
    loading: () => <Skeleton isLoaded={false} />,
  }
);

const BookingSecondStage = dynamic(
  () => import("./EditBookingStages/BookingSecondStage"),
  {
    loading: () => <Skeleton isLoaded={false} />,
  }
);

const BookingConfirmation = dynamic(
  () => import("./EditBookingStages/BookingConfirmation"),
  {
    loading: () => <Skeleton isLoaded={false} />,
  }
);

const EditBookingContent = ({ bookingId }: { bookingId: string }) => {
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState(0);
  const [roomPreference, setRoomPreference] = useState("");
  const [dogsInRooms, setDogsInRooms] = useState<any>([]);
  const [hasOverlap, setHasOverlap] = useState<boolean>(false); // Flag added here
  const {
    booking,
    setBooking,
    dateArrival,
    setDateArrival,
    dateDeparture,
    setDateDeparture,
    taxiArrival,
    setTaxiArrival,
    taxiDeparture,
    setTaxiDeparture,
    extraDay,
    setExtraDay,
  } = useEditBookingStore();

  const router = useRouter();
  const { closeModal } = useModalStore();

  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      try {
        const res = await getBookingById(bookingId);
        const data = JSON.parse(res);

        setDogsInRooms(data.dogs.map((dog: any) => ({ ...dog })));
        setRoomPreference(data.roomPreference);
        setDateArrival(new Date(data.fromDate));
        setDateDeparture(new Date(data.toDate));
        setTaxiArrival(data.flag1);
        setTaxiDeparture(data.flag2);
        setExtraDay(data.extraDay || false);
        setBooking(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);
  const handleNextFromFirstStage = useCallback((overlapDetected: boolean) => {
    setHasOverlap(overlapDetected);
    if (overlapDetected) {
      setStage(1); // Go to room selection
    } else {
      setStage(2); // Go directly to confirmation
    }
  }, []);

  const handleBackFromConfirmation = useCallback(() => {
    if (hasOverlap) {
      setStage(1);
    } else {
      setStage(0);
    }
  }, [hasOverlap]);
  const handleFinalConfirm = async () => {
    try {
      const dogsData = dogsInRooms.map((dog: any) => ({
        dogId: dog.dogId,
        dogName: dog.dogName,
        roomId: dog.roomId,
        roomName: dog.roomName,
      }));

      const res = await updateBookingAllInclusive({
        dogsData,
        booking,
        extraDay,
        rangeDate: { from: dateArrival, to: dateDeparture },
        isTransport1: taxiArrival,
        isTransport2: taxiDeparture,
        roomPreference,
      });

      const result = JSON.parse(res);
      if (result) {
        toast.success("Η κράτηση ενημερώθηκε επιτυχώς!");
        closeModal();
        router.refresh();
      }
    } catch (error) {
      toast.error("Η ενημέρωση της κράτησης απέτυχε!");
    }
  };

  const renderContent = useCallback(() => {
    switch (stage) {
      case 0:
        return (
          <BookingFirstStage handleNextOverlap={handleNextFromFirstStage} />
        );
      case 1:
        return (
          <BookingSecondStage
            setData={setDogsInRooms}
            booking={booking}
            setRoomPreference={setRoomPreference}
            setStage={setStage}
            clientId={booking?.client?.clientId}
          />
        );
      case 2:
        return (
          <BookingConfirmation
            client={{
              id: booking?.client?.clientId,
              name: booking?.client?.clientName,
              avatar: "/placeholder.svg?height=40&width=40",
              location: booking?.client?.location,
              phone: booking?.client?.phone,
            }}
            dogs={booking?.dogs || []}
            rooms={dogsInRooms.map((d: any) => ({
              id: d.roomId,
              name: d.roomName,
              capacity: 0,
            }))}
            bookingDetails={{
              arrivalDate: dateArrival!,
              departureDate: dateDeparture!,
              extraDay,
              petTaxiArrival: taxiArrival,
              petTaxiDeparture: taxiDeparture,
              bookingFee: booking?.client?.bookingFee || 0,
              transportFee: booking?.client?.transportFee || 0,
            }}
            onBack={handleBackFromConfirmation}
            onConfirm={handleFinalConfirm}
          />
        );
      default:
        return null;
    }
  }, [
    stage,
    booking,
    dogsInRooms,
    roomPreference,
    dateArrival,
    dateDeparture,
    extraDay,
    taxiArrival,
    taxiDeparture,
  ]);

  return <Skeleton isLoaded={!loading}>{renderContent()}</Skeleton>;
};

export default EditBookingContent;
