import { Button } from "@heroui/react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, Check } from "lucide-react";
import React from "react";

const ReferenceCommand2 = ({ clients, value, onChange }: any) => {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<any>();
  const [other, setOther] = React.useState<any>("");

  return (
    <div className="flex w-[30vw]  flex-col items-start gap-2 max-lg:w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="bordered"
            color="secondary"
            role="combobox"
            aria-expanded={open}
            className="min-h-[55px] w-full justify-between truncate bg-transparent tracking-widest max-lg:w-full"
          >
            {selected || "Επιλογή Συστάσεων"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0 dark:bg-neutral-900">
          <Command>
            <CommandInput placeholder="" />
            <CommandList className="font-sans">
              <CommandEmpty>ΚΑΝΕΝΑ ΑΠΟΤΕΛΕΣΜΑ</CommandEmpty>
              <CommandGroup heading="Άλλα" className="text-light-700">
                <CommandItem
                  value="Google"
                  onSelect={() => {
                    setSelected("Google");
                    delete value.client;
                    delete value.other;
                    setOther("");
                    onChange({ google: true });
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 text-lg tracking-widest",
                      value.google ? "opacity-100" : "opacity-0"
                    )}
                  />
                  Google
                </CommandItem>
                <CommandItem
                  value="Αλλο"
                  onSelect={() => {
                    setSelected("Άλλο");

                    delete value.google;
                    delete value.client;
                  }}
                >
                  <Input
                    placeholder="Άλλο"
                    value={other}
                    onChange={(e) => {
                      setOther(e.target.value);
                      onChange({ other: e.target.value });
                    }}
                  />
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />
              <CommandGroup heading="Πελάτες" className="text-light-700">
                {clients.map((client: any) => (
                  <CommandItem
                    key={client._id}
                    value={client.name}
                    onSelect={(currentValue) => {
                      setSelected(client.name);
                      delete value.google;
                      delete value.other;
                      setOther("");
                      onChange({
                        client: { clientId: client._id, name: client.name },
                      });
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 text-lg tracking-widest",
                        value?.client?.clientId === client._id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {client.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
export default ReferenceCommand2;
