"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  filters: any[];
  otherClasses?: string;
  containerClasses?: string;
}

const FilterCategories = ({
  filters,
  otherClasses,
  containerClasses,
}: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paramFilter = searchParams.get("categ");

  const handleUpdateParams = (value: string) => {
    if (value === "Όλα") {
      const newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["categ"],
      });
      router.push(newUrl, { scroll: false });
      return;
    }

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "categ",
      value,
    });

    router.push(newUrl, { scroll: false });
  };
  const updatedFilters = [{ _id: "all", name: "Όλα" }, ...filters];
  return (
    <div className={`relative ${containerClasses}`}>
      <Select
        onValueChange={handleUpdateParams}
        defaultValue={paramFilter || undefined}
      >
        <SelectTrigger
          className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Φίλτρα" />
          </div>
        </SelectTrigger>
        <SelectContent className="text-dark500_light700 small-regular border-none bg-light-900 dark:bg-dark-300">
          <SelectGroup>
            {updatedFilters.map((item) => (
              <SelectItem
                key={item._id}
                value={item.name}
                className="focus:bg-light-800 dark:focus:bg-dark-400"
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

export default FilterCategories;
