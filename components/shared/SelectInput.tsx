"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
const SelectInput = ({ className, data, field, title }: any) => {
  const [stringData, setStringData] = React.useState<string>(
    field?.value ? field.value : ""
  );
  const [show, setShow] = React.useState(false);

  return (
    <Popover>
      <div className={cn("relative max-w-[200px]", className)}>
        <Input
          className="background-light900_dark300 text-dark300_light700 paragraph-regular light-border-2 form_input max-w-[400px] font-sans font-bold"
          type="string"
          disabled={field.value !== "other"}
          value={stringData}
          onChange={(e) => {
            const input = e.target.value;
            setStringData(input);
            field.onChange(input);
          }}
        />
        <PopoverTrigger asChild>
          <Button
            onClick={() => setShow(!show)}
            variant={"outline"}
            className={cn(
              "font-normal absolute right-0 translate-y-[-50%] top-[50%] border-none mr-2",
              !data && "text-muted-foreground"
            )}
          >
            <Image
              src={`/assets/icons/command.svg`}
              className=" dark:invert"
              height={20}
              width={20}
              alt="command object-contain"
            />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="background-light900_dark300 text-dark300_light700 absolute right-[-32px] top-0 min-h-[300px] w-auto min-w-[200px] p-0 font-sans">
        <ScrollArea className="h-72 w-48 rounded-md text-center">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">{title}</h4>
            {data?.map((data: any) => (
              <div key={data._id}>
                <div
                  className="text-sm hover:bg-blue-400"
                  onClick={() => {
                    setStringData(data.name);
                    field.onChange(data.name);
                  }}
                >
                  {data.name}
                </div>
                <Separator className="my-2" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default SelectInput;
