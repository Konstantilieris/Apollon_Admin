"use client";
import React, { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  IconArrowRight,
  IconDog,
  IconDogBowl,
  IconLoader,
  IconQuestionMark,
} from "@tabler/icons-react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { getAllAvailableRooms } from "@/lib/actions/booking.action";
import { cn, getDayAndMonth } from "@/lib/utils";
import BookingSuggestionResult from "./BookingSuggestionResult";
import SelectRooms from "./SelectRooms";
import CreateBooking from "../CreateBooking/CreateBooking";
interface dogInRoom {
  dogId: string;
  dogName: string;
  roomId: string | null;
  roomName: string | null;
}
const BookingSuggestion = ({
  client,
  rooms,
  rangeDate,
  taxiArrival,
  taxiDeparture,
  setOpen,
  open,
}: any) => {
  const [loading, setLoading] = React.useState(false);
  const [openSuggestion, setOpenSuggestion] = React.useState(false);
  const ref = useRef(null);
  const [stages, setStages] = React.useState(0);
  const [availableRooms, setAvailableRooms] = React.useState<any>([]);
  const [isNext, setIsNext] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);
  const fromDate = getDayAndMonth(rangeDate.from);
  const toDate = getDayAndMonth(rangeDate.to);
  const [data, setData] = React.useState<any>();
  const [roomPreference, setRoomPreference] = React.useState(
    client.roomPreference
  );
  const [freeCapacityPercentage, setFreeCapacityPercentage] =
    React.useState("");
  useOutsideClick(ref, () => {
    setOpenSuggestion(false);
    setOpen(false);
  });
  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const { emptyRooms, freeCapacityPercentage } =
          await getAllAvailableRooms({
            rangeDate,
          });

        if (emptyRooms.length > 0) {
          setAvailableRooms(emptyRooms);
          setIsNext(isNext);
          setFreeCapacityPercentage(freeCapacityPercentage);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setOpenSuggestion(true);
      }
    };
    fetchSuggestions();
  }, [rangeDate]);

  useEffect(() => {
    if (openSuggestion) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [openSuggestion]);
  const clientData = {
    clientId: client._id,
    clientName: client.name,
    phone: client.phone.mobile,
    location: client.location.address + ", " + client.location.city,
    transportFee: client.transportFee,
    bookingFee: client.bookingFee,
  };
  if (loading) {
    return (
      <AnimatePresence>
        <>
          {/* Background overlay */}
          <motion.div
            className="fixed left-0 top-0 z-30 h-full w-full bg-dark-100/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.span
            className="fixed  left-[50vw] top-[40vh] z-50  rounded-xl text-2xl  "
            style={{ color: "#FFD700" }}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 2,
              ease: "easeIn",
              repeat: Infinity,
              repeatDelay: 1,
              repeatType: "reverse",
            }}
          >
            <IconLoader size={60} className="animate-spin" />
          </motion.span>
        </>
      </AnimatePresence>
    );
  }
  if (openSuggestion && !loading) {
    return (
      <BookingSuggestionResult stages={stages} isRef={ref}>
        {stages === 0 ? (
          <SelectRooms
            client={client}
            availableRooms={availableRooms}
            rangeDate={rangeDate}
            setStages={setStages}
            setData={setData}
            setRoomPreference={setRoomPreference}
          />
        ) : (
          <CreateBooking
            dogs={data}
            client={clientData}
            roomPreference={roomPreference}
            setStage={setStages}
          />
        )}
      </BookingSuggestionResult>
    );
  }
};

export default BookingSuggestion;
