import { motion } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils"; // Assuming you have a utility for classnames

import FirstStage from "./FirstStage";
import SecondStage from "./SecondStage";
import ThirdStage from "./ThirdStage";
import useCalendarModal from "@/hooks/use-calendar-modal";

import FourthStage from "./FourthStage";
import { getClientByIdForBooking } from "@/lib/actions/client.action";
import { getBookingById } from "@/lib/actions/booking.action";
import useEditBookingStore from "@/hooks/editBooking-store";

export const CustomModal: React.FC = () => {
  // Framer motion variants for open/close animations
  const ref = useRef(null);
  const [client, setClient] = useState<any>();
  const { open, onClose, selectedEvent, pairDate, stage, setStage, reset } =
    useCalendarModal();
  const [data, setData] = useState<any>(
    selectedEvent?.dogsData ? selectedEvent?.dogsData : []
  );

  const {
    setDateArrival,
    setDateDeparture,
    setTaxiArrival,
    setTaxiDeparture,
    booking,
    setBooking,
    setExtraDay,
  } = useEditBookingStore();

  const [roomPreference, setRoomPreference] = useState("");
  const backdropVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    }),
    []
  );

  const modalVariants = useMemo(
    () => ({
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    }),
    []
  );
  useEffect(() => {
    if (selectedEvent && pairDate) {
      setDateArrival(
        selectedEvent.isArrival
          ? new Date(selectedEvent.StartTime)
          : new Date(pairDate)
      );
      setDateDeparture(
        selectedEvent.isArrival
          ? new Date(pairDate)
          : new Date(selectedEvent.EndTime)
      );
    }
  }, [selectedEvent, pairDate]);
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedEvent?.Id) return;
      const res = await getBookingById(
        JSON.parse(JSON.stringify(selectedEvent.Id))
      );

      setBooking(JSON.parse(res));
      setExtraDay(JSON.parse(res).extraDay);
    };
    fetchData();
  }, [selectedEvent]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedEvent?.clientId) return;
      const res = await getClientByIdForBooking(selectedEvent?.clientId);
      if (!res) return;
      setClient(JSON.parse(res));
    };
    fetchData();
  }, [selectedEvent]);
  useEffect(() => {
    if (client) {
      setRoomPreference(client.roomPreference);
    }
  }, [client]);
  useEffect(() => {
    if (booking) {
      setTaxiArrival(booking.flag1);
      setTaxiDeparture(booking.flag2);
    } else {
      setTaxiArrival(false);
      setTaxiDeparture(false);
    }
  }, [booking]);
  if (!open) return null;

  const renderContent = () => {
    switch (stage) {
      case 0:
        return (
          <FirstStage
            event={selectedEvent}
            price={booking?.totalAmount}
            pairDate={pairDate!}
            setStage={setStage}
            onClose={onClose}
            reset={reset}
          />
        );
      case 1:
        return (
          <SecondStage
            event={selectedEvent}
            setStage={setStage}
            stage={stage}
            booking={booking}
          />
        );
      case 2:
        return (
          <ThirdStage
            event={selectedEvent}
            setData={setData}
            setRoomPreference={setRoomPreference}
            setStage={setStage}
            client={client}
          />
        );
      case 3:
        return (
          <FourthStage
            stage={stage}
            roomPreference={roomPreference}
            bookingId={selectedEvent.Id}
            data={JSON.parse(JSON.stringify(data))}
            setStage={setStage}
            onClose={onClose}
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={backdropVariants}
      onClick={onClose}
      // Close modal on click outside the content
    >
      <motion.div
        className={cn(
          "relative bg-white rounded-lg shadow-lg w-[60vw]  p-6 dark:bg-neutral-800 h-[60vh]"
        )}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        ref={ref} // Prevent closing when clicking inside modal
      >
        {renderContent()}
      </motion.div>
    </motion.div>
  );
};
