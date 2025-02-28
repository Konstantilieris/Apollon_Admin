"use client";
import React, { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
interface CustomInputProps {
  route: string;

  placeholder: string;
  otherClasses?: string;
}
const LocalSearch = ({
  route,

  placeholder,
  otherClasses,
}: CustomInputProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [searchTerm, setSearchTerm] = useState(query || "");
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "q",
          value: searchTerm,
        });
        router.push(newUrl, { scroll: false });
      } else {
        const newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["q"],
        });
        router.push(newUrl, { scroll: false });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, searchParams, query, pathname, router, route]);
  // useEffect to remove the page number if the search term changes
  useEffect(() => {
    const newUrl = removeKeysFromQuery({
      params: searchParams.toString(),
      keysToRemove: ["page"],
    });
    router.push(newUrl, { scroll: false });
  }, [searchTerm]);

  return (
    <div
      className={`background-light700_dark400 flex max-h-[56px] grow items-center  rounded-[10px] px-4 ${otherClasses}  font-bold`}
    >
      {!searchTerm && <span className="text-light850_dark500">🔍</span>}
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="paragraph-regular no-focus text-dark400_light800  border-none bg-transparent  shadow-none outline-none  placeholder:tracking-widest placeholder:text-light-800"
      />
    </div>
  );
};

export default LocalSearch;
