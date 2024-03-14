"use client";
import React, { Suspense } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import BookingForm from "../form/BookingForm";
import { Button } from "../ui/button";

import LoadingSkeleton from "./LoadingSkeleton";

const RoomDrawer = ({ open, setOpen, rooms, clients, rangeDate }: any) => {
  return (
    <Suspense
      fallback={<LoadingSkeleton size={20} animation="animation-spin" />}
    >
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="text-dark200_light800 background-light850_dark100  flex max-h-[800px] min-h-[500px] px-8">
          <DrawerHeader className="  self-start font-noto_sans">
            <DrawerTitle className=" text-xl">
              Επιλέγοντας απλά τις ημερομηνίες που επιθυμείτε. Εξασφαλίστε την
              ιδανική διαμονή για τον σκύλο σε λίγα κλικ!
            </DrawerTitle>
          </DrawerHeader>

          <BookingForm
            rooms={rooms}
            rangeDate={rangeDate}
            clients={clients}
            open={open}
            close={setOpen}
          />

          <DrawerFooter>
            <Button
              className="drawer_btn_close max-h-[120px] self-center"
              onClick={() => setOpen(false)}
            >
              ΑΚΥΡΩΣΗ
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Suspense>
  );
};

export default RoomDrawer;
