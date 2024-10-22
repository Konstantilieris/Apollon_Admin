"use client";

import React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { CircleOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ColorPicker from "../ColorPicker";
import Image from "next/image";
import { cn } from "@/lib/utils";

const SubCategoryCommand = ({
  mainData,
  onChange,
  isIcon,
  isColor,
  value,
  title,
  subTitle,
  create,
  groupName,
  setSubCategory,
  subCategory,
  parentCategory,
  className,
}: any) => {
  const [show, setShow] = React.useState(false);
  const [name, setName] = React.useState("");
  const [icon, setIcon] = React.useState("");
  const [color, setColor] = React.useState("#FFD700");
  const handleCreate = () => {
    create({ name, icon, color });
    setShow(false);
  };

  return (
    <>
      <Command>
        <CommandInput placeholder={title} />
        <CommandList className="self-center">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Ενέργειες">
            <CommandItem
              className="hover:scale-105"
              onSelect={() => setShow(true)}
            >
              Δημιουργία
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading={groupName}>
            <ScrollArea className="background-light900_dark300 text-dark100_light900 max-h-[150px]  min-h-fit rounded-lg">
              {mainData?.map((item: any) => (
                <CommandItem
                  key={item._id}
                  onSelect={() => {
                    if (item._id === subCategory?._id) {
                      setSubCategory(null);
                      return;
                    }
                    setSubCategory(item);
                  }}
                  className={cn(``, {
                    "hover:bg-celtic-green hover:scale-105":
                      subCategory?._id !== item._id,
                    "bg-blue-500": subCategory?._id === item._id,
                  })}
                >
                  {item.name}
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </CommandList>
      </Command>
      {show && (
        <Dialog onOpenChange={setShow} open={show}>
          <DialogContent className="text-dark500_light700 background-light850_dark100 ">
            <DialogHeader className="gap-4 ">
              <DialogTitle className="flex flex-row items-center gap-2 text-start">
                Προσθήκη στην κατηγορία{" "}
                <span className="  flex flex-row items-center gap-2 font-bold text-red-600">
                  {parentCategory.name}
                  <Image
                    src={parentCategory.img}
                    alt={parentCategory.name}
                    width={24}
                    height={24}
                  />
                </span>
              </DialogTitle>

              <DialogDescription className=" flex flex-col justify-center gap-4">
                <p className="flex flex-col gap-2">
                  <span className="text-start  text-lg">Όνομα</span>
                  <Input
                    className="text-dark200_light800 background-light900_dark200  min-h-[30px] max-w-[200px] border "
                    value={name}
                    placeholder="Όνομα"
                    onChange={(e) => setName(e.target.value)}
                  />
                  <span className="subtle-regular  text-blue-500">
                    {" "}
                    Έτσι θα εμφανίζεται η κατηγορία σας στην εφαρμογή
                  </span>
                </p>

                {isIcon && (
                  <Popover>
                    <span className=" text-lg">Διάλεξε εικονίδιο</span>
                    <PopoverTrigger asChild>
                      <Button variant={"outline"} className="h-[100px] w-full">
                        {icon ? (
                          <p className="flex flex-col items-center gap-2">
                            <span className="text-5xl" role="img">
                              {icon}
                            </span>
                            <p className="text-muted-foreground text-xs">
                              Click για αλλαγή
                            </p>
                          </p>
                        ) : (
                          <p className="flex flex-col items-center gap-2">
                            <CircleOff className="h-[48px] w-[48px]" />
                            <p className="text-muted-foreground text-xs">
                              Click για επιλογή
                            </p>
                          </p>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className=" background-light700_dark400 w-full p-2">
                      <Picker
                        data={data}
                        theme="dark"
                        onEmojiSelect={(emoji: { native: string }) => {
                          setIcon(emoji.native);
                        }}
                      />
                    </PopoverContent>
                    <span className="subtle-regular  text-blue-500">
                      {" "}
                      Έτσι θα εμφανίζεται η κατηγορία σας στην εφαρμογή
                    </span>
                  </Popover>
                )}
                {isColor && (
                  <div className="flex flex-row  gap-8 ">
                    <div className="flex flex-col gap-2 ">
                      <span className=" text-lg">Χρώμα</span>
                      <ColorPicker color={color} setColor={setColor} />
                      <span
                        className="subtle-regular flex  flex-row items-center gap-2  "
                        style={{ color }}
                      >
                        Έτσι θα εμφανίζεται η κατηγορία σας στην εφαρμογή
                        <span
                          className="flex-center h-fit max-h-[40px] max-w-[40px] self-center rounded-full bg-blue-600 p-2  text-xl"
                          style={{ backgroundColor: color }}
                        >
                          {icon || ""}
                        </span>
                      </span>
                    </div>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button
                className="h-11 w-24 rounded-lg border border-white bg-rose-950 p-2 text-white hover:bg-rose-700 hover:text-white"
                onClick={() => setShow(false)}
              >
                Ακύρωση
              </Button>
              <Button
                disabled={!name || !icon || !color}
                className="h-11 w-24 rounded-lg border border-white bg-green-700 p-2 text-white hover:bg-green-500 hover:text-white"
                onClick={() => handleCreate()}
              >
                Προσθήκη
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default SubCategoryCommand;
