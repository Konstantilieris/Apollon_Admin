import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

import DeleteButton from "../buttons/DeleteButton";
const ExpenseCard = ({ item }: any) => {
  return (
    <Card
      className="relative flex   w-[330px]  flex-col items-center justify-evenly  rounded-2xl object-contain p-8 shadow-md shadow-slate-500 max-2xl:p-2 max-lg:flex-wrap sm:w-[400px] md:min-h-[120px] md:w-[500px] lg:max-h-[150px] lg:w-[650px] 2xl:max-h-[220px] 2xl:w-[850px]"
      style={{ backgroundColor: item.category.color }}
    >
      <p className="absolute bottom-2 right-2 max-2xl:hidden">
        Δημιουργήθηκε : {formatDate(new Date(item.createdAt), "el")}
      </p>
      <Image
        src={"/assets/icons/receipt.svg"}
        width={60}
        height={30}
        alt="icon"
        className="absolute left-2 top-2 max-2xl:hidden "
      />{" "}
      <DeleteButton item={JSON.parse(JSON.stringify(item))} />
      <CardTitle className="text-dark200_light800 w-full text-center font-noto_sans font-bold ">
        {item.description.toUpperCase()}{" "}
      </CardTitle>
      <CardContent className="mt-10 flex flex-row items-center justify-evenly gap-2">
        <span className="background-light900_dark200 light-border text-light850_dark500 flex max-h-[30px] flex-row items-center gap-2 self-center rounded-2xl p-8 max-2xl:h-[20px] max-2xl:text-[18px]">
          {formatDate(new Date(item.date), "el").toUpperCase()}
          <Image
            src={"/assets/icons/calendar.svg"}
            width={30}
            height={30}
            alt="calendar"
          />
        </span>
        <span className="background-light900_dark200 light-border text-light850_dark500 flex max-h-[30px] flex-row items-center  gap-2 rounded-2xl p-8 max-2xl:h-[20px] max-2xl:text-[18px]">
          &bull; ΣΥΝΟΛΟ : {item.amount}
          <Image
            alt="euro"
            src={"/assets/icons/euro2.svg"}
            width={30}
            height={30}
            className="dark:invert"
          />
        </span>
      </CardContent>
    </Card>
  );
};

export default ExpenseCard;
