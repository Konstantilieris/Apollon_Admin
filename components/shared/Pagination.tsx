"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { formUrlQuery } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
interface Props {
  pageNumber: number;
  isNext: boolean | undefined;
}

const Pagination = ({ pageNumber, isNext }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleNavigation = (direction: string) => {
    const nextPageNumber =
      direction === "next" ? pageNumber + 1 : pageNumber - 1;
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPageNumber.toString(),
    });
    router.push(newUrl);
  };

  return (
    <div className="flex w-full items-center justify-center gap-2  p-2">
      <Button
        disabled={pageNumber === 1}
        className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border "
        onClick={() => handleNavigation("prev")}
      >
        <IconArrowLeft size={20} />
      </Button>
      <div className="flex items-center justify-center rounded-md bg-yellow-500 px-3.5 py-2">
        <span className=" font-extrabold text-dark-100">{pageNumber}</span>
      </div>
      <Button
        disabled={!isNext}
        className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border "
        onClick={() => handleNavigation("next")}
      >
        <IconArrowRight size={20} />
      </Button>
    </div>
  );
};

export default Pagination;
