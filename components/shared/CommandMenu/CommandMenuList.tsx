import React from "react";
import { ButtonGroup, Button } from "@heroui/react";
import {
  CommandMenuType,
  useCommandMenuStore,
} from "@/hooks/command-menu-store";

const CommandMenuList = ({
  menuType,
  disabled,
}: {
  menuType: CommandMenuType;
  disabled: boolean;
}) => {
  const menuTypes = {
    Professions: "ΕΠΑΓΓΕΛΜΑΤΑ",
    Breeds: "ΦΥΛΕΣ",
    Foods: "ΤΡΟΦΕΣ",
    Behaviors: "ΣΥΜΠΕΡΙΦΟΡΕΣ",
    Tags: "ΕΤΙΚΕΤΕΣ",
  };

  const { setMenuType } = useCommandMenuStore();

  return (
    <ButtonGroup
      className=" mt-2 h-full max-w-[1/3]  flex-col  justify-start gap-4"
      variant="flat"
    >
      {Object.entries(menuTypes).map(([type, label], index) => (
        <Button
          className="w-full font-sans tracking-widest"
          key={type + index}
          size="md"
          variant={menuType === type ? "solid" : "bordered"}
          color={"default"}
          isDisabled={disabled && menuType !== type}
          onPress={() => {
            setMenuType(type as typeof menuType);
          }}
        >
          {label}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default CommandMenuList;
