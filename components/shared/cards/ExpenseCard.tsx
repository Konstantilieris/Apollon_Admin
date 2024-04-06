import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
const ExpenseCard = ({ item }: any) => {
  return (
    <Card
      className="min-w-[400px] border-2 border-slate-500 font-noto_sans"
      style={{ backgroundColor: item.category.color }}
    >
      <CardHeader>
        <CardTitle className="text-center  font-bold">
          {item.category.name}
        </CardTitle>
        <p className="text-center text-[18px] italic">
          {" "}
          Για {formatDate(new Date(item.date), "el")}
        </p>
        <CardDescription className="text-center text-[25px] font-semibold">
          {item.description.toUpperCase()}{" "}
        </CardDescription>
      </CardHeader>
      <CardContent className=" text-center">
        <p className="flex flex-row items-center justify-center gap-2 text-[30px] font-semibold">
          {item.amount}
          <Image
            alt="euro"
            src={"/assets/icons/euro.svg"}
            width={30}
            height={30}
          />
        </p>
      </CardContent>
      <CardFooter>
        <p>Δημιουργήθηκε : {formatDate(new Date(item.createdAt), "el")}</p>
      </CardFooter>
    </Card>
  );
};

export default ExpenseCard;
