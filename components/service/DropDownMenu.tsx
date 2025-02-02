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
  IconMail,
  IconReceipt,
} from "@tabler/icons-react";

import { useServiceModal } from "@/hooks/use-service-modal";
import useServiceClientStore from "@/hooks/service-clientId";

export function DropdownMenuAction({ service }: { service: any }) {
  const { setOpen, setSelectedServices } = useServiceModal();
  const { setClientId } = useServiceClientStore();
  const handleOpen = (type: string) => {
    console.log(service);
    setClientId(service.clientId._id);
    setSelectedServices([service], type);
    setOpen();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="ml-2 bg-dark-100 px-4 py-1 text-white transition hover:scale-110 hover:bg-yellow-600"
          >
            <IconCashRegister size={20} className="text-light-900 " />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className=" w-56  bg-dark-200 font-sans"
          align="center"
        >
          <DropdownMenuLabel>ΕΝΕΡΓΕΙΕΣ</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="flex w-full cursor-pointer flex-row justify-between  hover:scale-105"
              onClick={() => handleOpen("Payment")}
            >
              Εξόφληση
              <IconCardsFilled size={20} className="text-green-500/70 " />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex w-full cursor-pointer flex-row justify-between  hover:scale-105"
              onClick={() => handleOpen("PartialPayment")}
            >
              Έναντι Πληρωμή
              <IconCardsFilled size={20} className="text-green-500/70 " />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex w-full cursor-pointer flex-row justify-between  hover:scale-105"
              onClick={() => handleOpen("Edit")}
            >
              Επεξεργασία
              <IconCardsFilled size={20} className="text-green-500/70 " />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex w-full cursor-pointer flex-row justify-between  hover:scale-105"
              onClick={() => handleOpen("Delete")}
            >
              Διαγραφή
              <IconCardsFilled size={20} className="text-green-500/70 " />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex w-full cursor-pointer flex-row justify-between  hover:scale-105"
              onClick={() => handleOpen("Discount")}
            >
              Έκπτωση
              <IconCardsFilled size={20} className="text-green-500/70 " />
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex w-full cursor-pointer flex-row justify-between  hover:scale-105"
              onClick={() => handleOpen("Print")}
            >
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
