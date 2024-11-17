"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formUrlQuery } from "@/lib/utils";

import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  filters: {
    name: string;
    value: string;
  }[];
  otherClasses?: string;
  containerClasses?: string;
}

const Filter = ({ filters, otherClasses, containerClasses }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paramFilter = searchParams.get("filter");

  const handleUpdateParams = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "filter",
      value,
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className={`relative ${containerClasses} `}>
      <Select
        onValueChange={handleUpdateParams}
        defaultValue={paramFilter || undefined}
      >
        <SelectTrigger
          // eslint-disable-next-line tailwindcss/no-custom-classname
          className={`${otherClasses} body-regular  text-dark500_light700   min-h-12 border-none bg-light-700   p-4 font-sans text-lg dark:bg-neutral-800`}
        >
          <div className="line-clamp-1 flex-1 border-none text-center">
            <SelectValue placeholder="Ταξινόμηση" />
          </div>
        </SelectTrigger>
        <SelectContent className="text-dark500_light700 small-regular border-none bg-light-900 dark:bg-neutral-800 ">
          <SelectGroup>
            {filters.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                className=" font-sans text-lg focus:bg-light-800 dark:focus:bg-dark-400"
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
