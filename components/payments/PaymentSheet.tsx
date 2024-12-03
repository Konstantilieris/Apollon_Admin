import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import { IconCreditCardPay } from "@tabler/icons-react";
import IncomeForm from "../form/IncomeForm";

const CreatePaymentTrigger = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="self-end">
      <button
        onClick={() => setIsOpen(true)}
        className=" rounded bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2  text-white transition-opacity hover:opacity-90"
      >
        ΔΗΜΙΟΥΡΓΙΑ ΕΣΟΔΟΥ
      </button>
      <SpringModalPayment isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

const SpringModalPayment = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-x-0 top-0 z-50 grid cursor-pointer place-items-center overflow-y-scroll bg-slate-900/20 p-8 backdrop-blur"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full min-w-[40vw] max-w-lg cursor-default overflow-hidden rounded-lg bg-gradient-to-br from-neutral-950 to-indigo-600 p-6 text-white shadow-xl"
          >
            <IconCreditCardPay
              size={250}
              className=" absolute -left-10 -top-20 z-0 text-light-900/20"
            />
            <div className="relative z-10">
              <div className="mx-auto mb-2 grid h-16 w-16 place-items-center rounded-full bg-white text-3xl text-indigo-600">
                <IconCreditCardPay />
              </div>
              <IncomeForm setIsOpen={setIsOpen} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreatePaymentTrigger;
