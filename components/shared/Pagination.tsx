"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Pagination as HeroPagination } from "@heroui/react";
import { formUrlQuery } from "@/lib/utils";

interface Props {
  totalPages: number;
}

const Pagination = ({ totalPages }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [searchParams]);

  const handleChange = (page: number) => {
    setCurrentPage(page);
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: page.toString(),
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="flex justify-center">
      <HeroPagination
        total={totalPages}
        page={currentPage}
        onChange={handleChange}
        showControls
        showShadow
        color="secondary"
      />
    </div>
  );
};

export default Pagination;
