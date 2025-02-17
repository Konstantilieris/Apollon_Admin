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
import { useServiceModal } from "@/hooks/use-service-modal";
import {
  IconCashRegister,
  IconMail,
  IconReceipt,
  IconTrash,
} from "@tabler/icons-react";
import { Service } from "../Tabs/OwesTab";
export function DropdownMenuActionPaid({
  selectedServices,
}: {
  selectedServices: Service[];
}) {
  const { setOpen, setSelectedServices } = useServiceModal();
  const handleOpen = (type: string) => {
    setSelectedServices(selectedServices, type);
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
              onClick={() => handleOpen("Print")}
            >
              Απόδειξη
              <IconReceipt size={20} className="text-gray-400/80 " />
            </DropdownMenuItem>

            <DropdownMenuItem className="flex w-full cursor-pointer flex-row justify-between  hover:scale-105">
              Email
              <IconMail size={20} className="text-gray-400/80 " />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex w-full cursor-pointer flex-row justify-between  hover:scale-105"
              onClick={() => handleOpen("Delete")}
            >
              Διαγραφή
              <IconTrash size={20} className="text-gray-400/80 " />
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
