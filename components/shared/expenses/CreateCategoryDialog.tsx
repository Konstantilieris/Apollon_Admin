"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { Input } from "@/components/ui/input";

import { CircleOff } from "lucide-react";
import ColorPicker from "../ColorPicker";
import { createSubCategory } from "@/lib/actions/expenses.action";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
const CreateCategoryDialog = ({ parentCategory }: { parentCategory: any }) => {
  const { toast } = useToast();
  const [show, setShow] = React.useState(false);
  const [name, setName] = React.useState("");
  const [icon, setIcon] = React.useState("");
  const [color, setColor] = React.useState("#FFD700");
  const handleCreate = async () => {
    try {
      const result = await createSubCategory({
        name,
        icon,
        color,
        parentCategoryId: parentCategory._id,
      });
      if (result) {
        toast({
          className: cn(
            "bg-celtic-green border-none text-white  font-sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Επιτυχία",
          description: `Επιτυχής προσθήκη υποκατηγορίας ${result?.name} στην κατηγορία ${parentCategory.name}`,
        });
      }
    } catch (error) {
      console.log("Error creating subcategory");
      toast({
        className: cn(
          "bg-rose-950 border-none text-white  font-sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Σφάλμα",
        description: `Αποτυχία προσθήκης υποκατηγορίας στην κατηγορία ${parentCategory.name}`,
      });
    } finally {
      setShow(false);
    }
  };

  return (
    <Dialog onOpenChange={setShow} open={show}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="mb-4 border-green-400 bg-green-700 text-base  text-white hover:bg-green-600 hover:text-white"
        >
          Νέα Υποκατηγορία
        </Button>
      </DialogTrigger>
      <DialogContent className="text-dark500_light700 background-light850_dark100 font-sans">
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
              <span className="text-start font-sans text-lg">Όνομα</span>
              <Input
                className="text-dark200_light800 background-light900_dark200  min-h-[30px] max-w-[200px] border font-sans"
                value={name}
                placeholder="Όνομα"
                onChange={(e) => setName(e.target.value)}
              />
              <span className="subtle-regular font-sans text-blue-500">
                {" "}
                Έτσι θα εμφανίζεται η κατηγορία σας στην εφαρμογή
              </span>
            </p>

            <Popover>
              <span className="font-sans text-lg">Διάλεξε εικονίδιο</span>
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
              <span className="subtle-regular font-sans text-blue-500">
                {" "}
                Έτσι θα εμφανίζεται η κατηγορία σας στην εφαρμογή
              </span>
            </Popover>

            <div className="flex flex-row  gap-8 ">
              <div className="flex flex-col gap-2 ">
                <span className="font-sans text-lg">Χρώμα</span>
                <ColorPicker color={color} setColor={setColor} />
                <span
                  className="subtle-regular flex  flex-row items-center gap-2 font-sans "
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
  );
};

export default CreateCategoryDialog;
