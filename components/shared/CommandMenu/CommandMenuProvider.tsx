"use client";
import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Divider,
} from "@heroui/react";
import CommandSearch from "./CommandSearch";
import CommandMenuList from "./CommandMenuList";
import CommandValueList from "./CommandValueList";
import {
  CommandMenuType,
  useCommandMenuStore,
} from "@/hooks/command-menu-store";
import { Icon } from "@iconify/react/dist/iconify.js";
import { renderTitle } from "@/lib/utils";

const CommandMenuProvider = ({
  defaultMenuType,
  disabled = false,
  isForm,
  TriggerComponent,
  hasTrigger = false,
  onChange,
  notrigger = false,
  value,
}: {
  defaultMenuType?: CommandMenuType;
  disabled?: boolean;
  TriggerComponent?: any;
  hasTrigger?: boolean;
  isForm: boolean;
  onChange: (value: string) => void;
  value?: string;
  notrigger?: boolean;
}) => {
  const { isCreate, setIsCreate, menuType } = useCommandMenuStore();
  const handleIsCreate = () => {
    if (isCreate) {
      setIsCreate(false);
      return;
    }
    setIsCreate(true);
  };

  // if defaultMenuType is provided set menuType store

  return (
    <Popover
      showArrow
      offset={10}
      placement="bottom"
      backdrop="blur"
      classNames={{
        content:
          "xl:w-[30vw]  md:[40vw] h-[40vh] p-4 max-md:w-[90vw] max-lg:h-[70vh] ",
      }}
    >
      <PopoverTrigger>
        {hasTrigger ? (
          TriggerComponent
        ) : (
          <Button
            color={value ? "success" : "secondary"}
            variant="bordered"
            className="min-h-[55px] min-w-[30vw] font-sans tracking-widest max-lg:w-full"
          >
            {!value
              ? renderTitle({ menuType: defaultMenuType ?? menuType })
              : value}
          </Button>
        )}
      </PopoverTrigger>

      <PopoverContent className="overflow-y-hidden">
        <div className="flex h-full w-full flex-col gap-2">
          <div className="flex flex-row items-end justify-between gap-2">
            <CommandSearch />
            <Button
              variant="ghost"
              color={"secondary"}
              className="font-sans tracking-widest"
              endContent={<Icon icon="akar-icons:plus" />}
              disabled={isCreate}
              onPress={handleIsCreate}
            >
              Προσθήκη
            </Button>
          </div>
          <div className="flex h-full w-full flex-row ">
            <CommandMenuList
              menuType={defaultMenuType ?? CommandMenuType.Professions}
              disabled={disabled}
            />
            <Divider orientation="vertical" className="ml-4" />
            <CommandValueList
              onChange={onChange}
              formValue={value}
              isForm={isForm}
              defaultMenuType={defaultMenuType ?? CommandMenuType.Professions}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CommandMenuProvider;
