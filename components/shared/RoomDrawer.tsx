"use client";
import React, { Suspense } from "react";
import { Drawer, DrawerContent, DrawerFooter } from "@/components/ui/drawer";

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
