"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
interface CustomInputProps {
  route: string;
  iconPosition: string;
  imgSrc: string;
  placeholder: string;
  otherClasses: string;
}
const SearchBar = ({
  route,
  iconPosition,
  imgSrc,
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

  return (
    <div
      className={`flex max-h-[50px] min-h-[36px]  grow items-center gap-4 rounded-[10px] bg-light-700  p-4  text-light-900 dark:bg-neutral-800  ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          alt="search Icon"
          width={24}
          height={24}
          className="cursor-pointer "
        />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="paragraph-regular  no-focus border-none bg-transparent text-lg shadow-none outline-none  placeholder:text-light-900 "
      />
      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          alt="search Icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default SearchBar;
