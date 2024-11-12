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
        "flex min-h-[15vh] min-w-[50vw] flex-col gap-4 rounded-lg border border-gray-700 p-4 shadow-sm shadow-gray-600 relative max-md:min-w-[42vw] max-md:pt-8",
        containerStyle
      )}
    >
      <h1
        className={cn(
          "text-2xl font-semibold text-gray-800 dark:text-light-900 max-md:hidden",
          titleStyle
        )}
      >
        {title}
      </h1>
      {infolist.map((info, index) => (
        <div
          key={index}
          className={cn(
            "flex w-full flex-row justify-between max-md:flex-col max-md:gap-2 max-md:items-start text-lg ",
            listStyle
          )}
        >
          {info.map((item: any, index) => (
            <div key={item.key} className="flex flex-row gap-2">
              <p className=" dark:text-light-700">{item.key}</p>
              <p className="flex flex-row items-center  text-gray-800 dark:text-yellow-400/90">
                {item.value}{" "}
                {isVet && item.key === "ΟΝΟΜΑ: " && (
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
          width={25}
          height={25}
        />
      )}
    </div>
  );
};

export default ClientInfoCard;
