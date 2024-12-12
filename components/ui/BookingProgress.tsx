"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import CreateBooking from "../clientProfile/Book/CreateBooking/CreateBooking";
import SelectRooms from "../clientProfile/Book/RoomResults/SelectRooms";
import SelectTimes from "../clientProfile/Book/RoomResults/SelectTimes";
import { useBookingStore } from "@/hooks/booking-store";
interface SteppedProgressProps {
  client: any;
}
const SteppedProgress = ({ client }: SteppedProgressProps) => {
  const { stepsComplete, setStepsComplete } = useBookingStore();

  const numSteps = 3;
  const clientData = {
    clientId: client._id,
    clientName: client.name,
    phone: client?.phone?.mobile
      ? client?.phone?.mobile
      : client?.phone?.telephone || "",
    location: client?.location?.address + ", " + client?.location?.city,
    transportFee: client.transportFee,
    bookingFee: client.bookingFee,
  };

  const renderStep = () => {
    switch (stepsComplete) {
      case 0:
        return <SelectTimes setStages={setStepsComplete} />;
      case 1:
        return <SelectRooms client={client} setStages={setStepsComplete} />;
      case 2:
        return (
          <CreateBooking client={clientData} setStage={setStepsComplete} />
        );
    }
  };

  return (
    <div className=" h-full w-full px-4 py-14">
      <div className="mx-auto h-full w-full rounded-md bg-neutral-950 p-8 shadow-lg">
        <Steps numSteps={numSteps} stepsComplete={stepsComplete} />
        <div className="relative my-6 min-h-[60vh] rounded-lg border-2 border-dashed border-neutral-600 bg-neutral-800 p-2">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

const Steps = ({
  numSteps,
  stepsComplete,
}: {
  numSteps: number;
  stepsComplete: number;
}) => {
  const stepArray = Array.from(Array(numSteps).keys());

  return (
    <div className="flex h-full items-center justify-between gap-3">
      {stepArray.map((num) => {
        const stepNum = num + 1;
        const isActive = stepNum <= stepsComplete;
        return (
          <React.Fragment key={stepNum}>
            <Step num={stepNum} isActive={isActive} />
            {stepNum !== stepArray.length && (
              <div className="relative h-1 w-full rounded-full bg-gray-200">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-yellow-500"
                  animate={{ width: isActive ? "100%" : 0 }}
                  transition={{ ease: "easeIn", duration: 0.3 }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const Step = ({ num, isActive }: { num: number; isActive: boolean }) => {
  return (
    <div className="relative">
      <div
        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors duration-300 ${
          isActive
            ? "border-yellow-600 bg-yellow-600 text-white"
            : "border-gray-300 text-gray-300"
        }`}
      >
        <AnimatePresence mode="wait">
          {isActive ? (
            <motion.svg
              key="icon-marker-check"
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 16 16"
              height="1.6em"
              width="1.6em"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ rotate: 180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
              transition={{ duration: 0.125 }}
            >
              <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"></path>
            </motion.svg>
          ) : (
            <motion.span
              key="icon-marker-num"
              initial={{ rotate: 180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
              transition={{ duration: 0.125 }}
            >
              {num}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      {isActive && (
        <div className="absolute -inset-1.5 z-0 animate-pulse rounded-full bg-indigo-100" />
      )}
    </div>
  );
};

export default SteppedProgress;
