import { useCommandMenuStore } from "@/hooks/command-menu-store";
import { Input } from "@heroui/input";
import { IconSearch } from "@tabler/icons-react";
import React from "react";

const CommandSearch = () => {
  const { searchValue, setSearchValue } = useCommandMenuStore();
  return (
    <Input
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      className="font-sans h-full flex-1 "
      color="secondary"
      variant="underlined"
      label="Aναζήτηση"
      endContent={<IconSearch className="text-purple-500" />}
    />
  );
};

export default CommandSearch;
