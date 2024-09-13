"use client";
import React from "react";
import { Button } from "@/components/ui/button";

import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";
interface Props {
  handleNextPage: () => void;
  handlePreviousPage: () => void;
  currentPage: number;
  totalPages: number;
}

const PaginatingRooms = ({
  handleNextPage,
  handlePreviousPage,
  currentPage,
  totalPages,
}: Props) => {
  return (
    <div className=" ml-8 flex w-full items-center  justify-center gap-2 p-2 text-yellow-500">
      <Button
        disabled={currentPage === 1}
        className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border "
        onClick={handlePreviousPage}
      >
        <IconArrowNarrowLeft />
      </Button>
      <div className="flex items-center justify-center rounded-md bg-yellow-600 px-3.5 py-2">
        <p className="body-semibold text-light-900">{currentPage}</p>
      </div>
      <Button
        disabled={currentPage === totalPages}
        className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border "
        onClick={handleNextPage}
      >
        <IconArrowNarrowRight />
      </Button>
    </div>
  );
};

export default PaginatingRooms;
