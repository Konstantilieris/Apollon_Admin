import { cn } from "@/lib/utils";
import React from "react";
import Image from "next/image";
import { IconLinkPlus } from "@tabler/icons-react";
import Link from "next/link";
interface ClientInfoProps {
  title: string;
  infolist: { key: string; value: any }[][];
  iconRight?: string;
  containerStyle?: string;
  titleStyle?: string;
  listStyle?: string;
  iconStyle?: string;
  isVet?: boolean;
}
const ClientInfoCard = ({
  title,
  infolist,
  iconRight,
  containerStyle,
  titleStyle,
  iconStyle,
  listStyle,
  isVet = false,
}: ClientInfoProps) => {
  return (
    <div
      className={cn(
        "flex min-h-[15vh] min-w-[50vw] flex-col gap-4 rounded-lg border border-indigo-400 p-4 shadow-sm shadow-MediumPurple relative max-md:min-w-[42vw] max-md:pt-8",
        containerStyle
      )}
    >
      <h1
        className={cn(
          "text-2xl font-semibold text-gray-800 dark:text-indigo-300 max-md:hidden",
          titleStyle
        )}
      >
        {title}
      </h1>
      {infolist.map((info, index) => (
        <div
          key={index}
          className={cn(
            "flex w-full flex-row justify-between max-md:flex-col max-md:gap-2 max-md:items-start ",
            listStyle
          )}
        >
          {info.map((item: any, index) => (
            <div key={item.key} className="flex flex-row gap-2">
              <p className="text-sm dark:text-light-700">{item.key}</p>
              <p className="flex flex-row items-center text-sm text-gray-800 dark:text-indigo-300">
                {item.value}{" "}
                {isVet && index === 0 && (
                  <Link
                    href={`https://www.google.com/search?q=${
                      item.value.replace(" ", "+") + "+κτηνιατρος"
                    }`}
                    target="_blank"
                    className="hover:scale-110"
                    passHref
                  >
                    <IconLinkPlus size={20} className="ml-1 text-green-500" />
                  </Link>
                )}
              </p>
            </div>
          ))}
        </div>
      ))}
      {iconRight && (
        <Image
          src={iconRight}
          alt="icon"
          className={cn("absolute top-3 right-2 ", iconStyle)}
          width={20}
          height={20}
        />
      )}
    </div>
  );
};

export default ClientInfoCard;
