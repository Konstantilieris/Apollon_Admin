/* eslint-disable tailwindcss/no-custom-classname */
import { cn } from "@/lib/utils";
import React from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

interface ClientInfoProps {
  datalist: any;
  containerStyle?: string;
  titleStyle?: string;
  listStyle?: string;
  iconStyle?: string;
  isVet?: boolean;
}
const ClientInfoCard = ({
  datalist,
  containerStyle,
  titleStyle,
  iconStyle,
  listStyle,
  isVet = false,
}: ClientInfoProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[15vh] min-w-[50vw]  rounded-lg border border-gray-700 p-4 shadow-sm shadow-gray-600 relative max-md:min-w-[42vw] max-md:pt-8 py-8 px-8",
        containerStyle
      )}
    >
      {datalist.map((data: any, index: number) => (
        <div key={index} className="flex flex-col ">
          <div className="flex flex-row items-center gap-2">
            <Image
              src={data.iconRight}
              alt="icon"
              width={24}
              height={24}
              className={cn(" ", iconStyle)}
            />
            <h3
              className={cn(
                "text-xl tracking-widest font-semibold",
                titleStyle
              )}
            >
              {data.sectionTitle}
            </h3>
          </div>
          <Separator className="max-w-80 my-4 bg-neutral-700" />
          <ul className={cn("flex flex-col gap-4", listStyle)}>
            {data.items.map((item: any, index: number) => (
              <li key={index} className="flex flex-row items-center gap-2">
                <h4 className="text-lg font-normal tracking-wide">
                  {item.key}
                </h4>
                <h4 className="text-lg font-normal">{item.value}</h4>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ClientInfoCard;
