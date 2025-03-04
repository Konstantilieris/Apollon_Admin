"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { cn, formUrlQuery } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";
interface Props {
  pageNumber: number;
  isNext: boolean | undefined;
  className?: string;
}

const ArrowPagination = ({ pageNumber, isNext, className }: Props) => {
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
    <div
      className={cn(
        "flex  w-full  items-center justify-center gap-2 p-2 text-yellow-500",
        className
      )}
    >
      <Button
        disabled={pageNumber === 1}
        className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border "
        onClick={() => handleNavigation("prev")}
      >
        <IconArrowNarrowLeft />
      </Button>
      <div className="flex items-center justify-center rounded-md bg-yellow-600 px-3.5 py-2">
        <p className="body-semibold text-light-900">{pageNumber}</p>
      </div>
      <Button
        disabled={!isNext}
        className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border "
        onClick={() => handleNavigation("next")}
      >
        <IconArrowNarrowRight />
      </Button>
    </div>
  );
};

export default ArrowPagination;
