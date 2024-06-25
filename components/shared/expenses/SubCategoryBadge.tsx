import { cn } from "@/lib/utils";
import React from "react";

const SubCategoryBadge = ({ sub }: { sub: any }) => {
  return (
    <span
      className={cn(
        "rounded-lg  min-h-[50px] flex flex-row items-center  text-dark100_light900 font-semibold max-md:text-xs lg:text-sm px-2 py-1 gap-1 dark:bg-dark-400 bg-light-500"
      )}
    >
      <span
        className=" flex justify-items-start rounded-full"
        style={{ backgroundColor: sub?.subcategory?.color }}
      >
        {sub?.subcategory?.icon}
      </span>
      <span className="mx-auto">
        {sub?.subcategory?.name}-{sub?.totalAmount} €
      </span>
    </span>
  );
};

export default SubCategoryBadge;
