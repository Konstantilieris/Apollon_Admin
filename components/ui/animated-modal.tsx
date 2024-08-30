import { AnimatePresence, motion } from "framer-motion";
import React, { ReactNode, useEffect } from "react";
import { IconSquareRoundedX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}
export const Modal = ({ children }: { children: React.ReactNode }) => {
  return <div className="">{children}</div>;
};
export const ModalBody = ({
  children,
  className,
  isOpen,
  setOpen,
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          className="fixed inset-0 z-50 flex h-full w-full items-center justify-center "
        >
          <Overlay />
          <motion.div
            className={cn(
              "min-h-[50%] max-h-[90%] md:max-w-[40%] bg-white dark:bg-neutral-950 border border-transparent dark:border-neutral-800 md:rounded-2xl relative z-50 flex flex-col flex-1 overflow-hidden",
              className
            )}
            initial={{ opacity: 0, scale: 0.5, rotateX: 40, y: 40 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateX: 10 }}
            transition={{ type: "spring", stiffness: 260, damping: 15 }}
          >
            <CloseIcon setOpen={setOpen} />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Overlay = ({ className }: { className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      className={`fixed inset-0 z-50 h-full w-full bg-black bg-opacity-50 ${className}`}
    ></motion.div>
  );
};

const CloseIcon = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  return (
    <IconSquareRoundedX
      onClick={() => setOpen(false)}
      className="absolute right-4 top-4 cursor-pointer text-red-600 transition duration-200 hover:scale-110"
    />
  );
};

export const ModalContent = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col flex-1 p-8 md:p-10 ", className)}>
      {children}
    </div>
  );
};
export const ModalFooter = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex justify-end p-4 bg-gray-100 dark:bg-neutral-900",
        className
      )}
    >
      {children}
    </div>
  );
};
