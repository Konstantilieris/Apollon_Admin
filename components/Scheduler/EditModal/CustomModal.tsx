import { motion } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils"; // Assuming you have a utility for classnames

import FirstStage from "./FirstStage";
import SecondStage from "./SecondStage";
import ThirdStage from "./ThirdStage";
import useCalendarModal from "@/hooks/use-calendar-modal";

import { DateRange } from "react-day-picker";
import FourthStage from "./FourthStage";
import { getClientByIdForBooking } from "@/lib/actions/client.action";
import { getBookingById } from "@/lib/actions/booking.action";

export const CustomModal: React.FC = () => {
  // Framer motion variants for open/close animations
  const ref = useRef(null);
  const [client, setClient] = useState<any>();
  const { open, onClose, selectedEvent, pairDate, stage, setStage, reset } =
    useCalendarModal();
  const [data, setData] = useState<any>(
    selectedEvent?.dogsData ? selectedEvent?.dogsData : []
  );
  const [booking, setBooking] = useState<any>();
  const [rangeDate, setRangeDate] = useState<DateRange | undefined>();
  const [isTransport1, setIsTransport1] = useState(false);
  const [isTransport2, setIsTransport2] = useState(false);
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
      setRangeDate({
        from: selectedEvent.isArrival
          ? new Date(selectedEvent.StartTime)
          : new Date(pairDate),
        to: selectedEvent.isArrival
          ? new Date(pairDate)
          : new Date(selectedEvent.EndTime),
      });
    }
  }, [selectedEvent, pairDate]);
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedEvent?.Id) return;
      const res = await getBookingById(
        JSON.parse(JSON.stringify(selectedEvent.Id))
      );

      setBooking(JSON.parse(res));
    };
    fetchData();
  }, [selectedEvent]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedEvent?.clientId) return;
      const res = await getClientByIdForBooking(selectedEvent?.clientId);
      setClient(JSON.parse(JSON.stringify(res)));
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
      setIsTransport1(booking.flag1);
      setIsTransport2(booking.flag2);
    } else {
      setIsTransport1(false);
      setIsTransport2(false);
    }
  }, [booking]);
  if (!open) return null;

  const renderContent = () => {
    switch (stage) {
      case 0:
        return (
          <FirstStage
            event={selectedEvent}
            pairDate={pairDate}
            setStage={setStage}
            onClose={onClose}
            reset={reset}
          />
        );
      case 1:
        return (
          <SecondStage
            event={selectedEvent}
            rangeDate={rangeDate}
            setStage={setStage}
            stage={stage}
            setRangeDate={setRangeDate}
            setIsTransport1={setIsTransport1}
            setIsTransport2={setIsTransport2}
            isTransport1={isTransport1}
            isTransport2={isTransport2}
            booking={booking}
          />
        );
      case 2:
        return (
          <ThirdStage
            event={selectedEvent}
            data={JSON.parse(JSON.stringify(data))}
            setData={setData}
            rangeDate={rangeDate}
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
            rangeDate={rangeDate}
            isTransport1={isTransport1}
            isTransport2={isTransport2}
            bookingId={selectedEvent.Id}
            data={JSON.parse(JSON.stringify(data))}
            setStage={setStage}
            onClose={onClose}
          />
        );
      default:
        return <FirstStage event={selectedEvent} pairDate={pairDate} />;
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
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
