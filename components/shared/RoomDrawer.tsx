"use client";
import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import BookingForm from "../form/BookingForm";
import { Button } from "../ui/button";

const RoomDrawer = ({ open, setOpen, room, clients, rangeDate }: any) => {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="text-dark200_light800 background-light850_dark100  flex max-h-[800px] px-8">
        <DrawerHeader className="  self-start font-noto_sans">
          <DrawerTitle className=" text-xl">
            Κάνετε Κράτηση στο {room.name}
          </DrawerTitle>
          <DrawerDescription className=" text-lg leading-8 ">
            {" "}
            Επιλέγοντας απλά τις ημερομηνίες που επιθυμείτε. Εξασφαλίστε την
            ιδανική διαμονή για τον σκύλο σε λίγα κλικ!
          </DrawerDescription>
        </DrawerHeader>
        <BookingForm room={room} rangeDate={rangeDate} clients={clients} />

        <DrawerFooter>
          <Button
            className="drawer_btn_close max-h-[120px] self-center"
            onClick={() => setOpen(!open)}
          >
            ΑΚΥΡΩΣΗ
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default RoomDrawer;
