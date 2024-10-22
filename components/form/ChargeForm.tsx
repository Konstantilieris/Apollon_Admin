"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import ServiceSwitcher from "../shared/constantManagement/ServiceSwitcher";
import { DateInput } from "../datepicker/DateInput";
import { Input } from "../ui/input";

import { Textarea } from "../ui/textarea";
import { chargeClient } from "@/lib/actions/service.action";
import { useToast } from "../ui/use-toast";

const ChargeForm = ({ client, services }: any) => {
  const [selectedService, setSelectedService] = React.useState("");
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    new Date()
  );
  const [selectedNote, setSelectedNote] = React.useState("");
  const handleCharge = async () => {
    try {
      const res = await chargeClient({
        clientId: client._id,
        serviceType: selectedService,
        amount: selectedAmount,
        date: selectedDate,
        note: selectedNote,
      });
      const service = JSON.parse(JSON.stringify(res));
      if (service) {
        setSelectedService("");
        setSelectedAmount("");
        setSelectedDate(new Date());
        setSelectedNote("");
        toast({
          className: cn(
            "bg-celtic-green border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Επιτυχία",
          description: "Η υπηρεσία δημιουργήθηκε",
        });
      }
    } catch (error) {
      console.error("Error charging client:", error);
      toast({
        className: cn(
          "bg-celtic-red border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Σφάλμα",
        description: "Η υπηρεσία δεν δημιουργήθηκε",
      });
    }
  };
  console.log(selectedService);
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={cn(
          "flex-1 flex flex-col gap-8 mt-20  max-w-[14vw] justify-center pl-8 "
        )}
        initial="initialState"
        animate="animateState"
        exit="exitState"
        transition={{ duration: 0.3, ease: "easeIn" }}
        variants={{
          initialState: {
            opacity: 0,
          },
          animateState: {
            opacity: 1,
          },
          exitState: {
            opacity: 0,
          },
        }}
      >
        <div className="flex flex-col gap-2 ">
          <span className="text-yellow-500">ΟΝΟΜΑ ΥΠΗΡΕΣΙΑΣ</span>
          <ServiceSwitcher
            items={services}
            client={client}
            setAmount={setSelectedAmount}
            selectedItem={selectedService}
            setSelectedItem={setSelectedService}
            placeholder="Επιλέξτε Υπηρεσία"
            heading="Υπηρεσίες"
            type="Services"
            label="Υπηρεσία"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-yellow-500">ΗΜΕΡΟΜΗΝΙΑ</span>
          <DateInput
            field={{ value: selectedDate, onChange: setSelectedDate }}
            color="dark:bg-dark-100"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-yellow-500">ΣΗΜΕΙΩΣΗ</span>
          <Textarea
            value={selectedNote || ""}
            onChange={(e) => setSelectedNote(e.target.value)}
            className="  min-h-[6vh] border-none  font-bold focus-visible:outline-none dark:bg-dark-100"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-yellow-500">ΚΟΣΤΟΣ</span>
          <Input
            type="number"
            value={selectedAmount}
            onChange={(e) => setSelectedAmount(e.target.value)}
            className="  min-h-[6vh] border-none  font-bold focus-visible:outline-none dark:bg-dark-100"
          />
        </div>
        <button
          onClick={() => handleCharge()}
          disabled={!selectedService || !selectedAmount}
          className=" rounded-md bg-light-900 px-8 py-2 font-bold text-yellow-700 shadow-[0_4px_14px_0_rgb(0,0,0,10%)] transition duration-200 ease-linear hover:scale-110 hover:shadow-[0_6px_20px_rgba(93,93,93,23%)]"
        >
          ΠΡΟΣΘΗΚΗ
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChargeForm;
