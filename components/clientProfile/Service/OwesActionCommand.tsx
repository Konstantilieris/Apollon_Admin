"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconCardsFilled,
  IconCashRegister,
  IconCircles,
  IconMail,
  IconReceipt,
} from "@tabler/icons-react";

import { Service } from "./OwesTab";

import { useServiceModal } from "@/hooks/use-service-modal";

export function DropdownMenuAction({ service }: { service: Service }) {
  const { setOpen, setCurrentData } = useServiceModal();
  const handleOpen = (type: string) => {
    setCurrentData(service, type);
    setOpen();
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="ml-2 rounded-full bg-purple-600 px-4 py-1 text-white transition hover:scale-110 hover:bg-green-600"
          >
            <IconCashRegister size={20} className="text-light-900 " />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className=" w-56  bg-dark-200" align="center">
          <DropdownMenuLabel>ΕΞΟΦΛΗΣΗ</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="flex w-full cursor-pointer flex-row justify-between  hover:scale-105"
              onClick={() => handleOpen("Payment")}
            >
              Πληρωμή
              <IconCardsFilled size={20} className="text-green-500/70 " />
            </DropdownMenuItem>
            <DropdownMenuItem className="flex w-full cursor-pointer flex-row justify-between  hover:scale-105">
              Πληρωμή Όλων
              <IconCircles size={20} className="text-green-500/70 " />
            </DropdownMenuItem>
            <DropdownMenuItem className="flex w-full cursor-pointer flex-row justify-between  hover:scale-105">
              Απόδειξη
              <IconReceipt size={20} className="text-gray-400/80 " />
            </DropdownMenuItem>
            <DropdownMenuItem className="flex w-full cursor-pointer flex-row justify-between  hover:scale-105">
              Email
              <IconMail size={20} className="text-gray-400/80 " />
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
