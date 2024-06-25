"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

import SubCategoryCarousel from "./SubCategoryCarousel";

import CreateCategoryDialog from "./CreateCategoryDialog";
import CreateExpenseDialog from "@/components/form/CreateExpenseDialog";
import LocalSearch from "../searchBar/LocalSearch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
const ExpenseInfo = ({ data, totalSum = 0, topSubCategory }: any) => {
  return (
    <div
      className={cn(
        `category-info background-light850_dark100 shadow-sm border-white rounded-lg text-dark200_light900 font-noto_sans max-h-[150px] min-h-[130px]`
      )}
    >
      <figure className={`flex-center h-fit rounded-full bg-blue-600`}>
        <Image
          src={data?.img}
          width={20}
          height={20}
          alt={data?.name}
          className="m-2 w-5 "
        />
      </figure>
      <div className="flex w-full flex-1 flex-col justify-center gap-1">
        <div className="category-info_content ">
          <div className="mt-1 self-start">
            <h2 className={` line-clamp-1 flex-1 font-bold  2xl:text-lg `}>
              {data?.name}
            </h2>
            <p className={` min-w-[100px] text-start  font-medium`}>
              <span className="2xl:text-lg"> Μηνιαία Έξοδα Κατηγορίας : </span>
              <span className="font-semibold text-red-500 dark:text-blue-300 2xl:text-lg">
                {totalSum} €
              </span>{" "}
            </p>
            <p className={`  min-w-[100px] text-start  font-medium`}>
              <span className="2xl:text-lg"> Κορυφαία Υποκατηγορία : </span>
              <span className="font-semibold text-red-500 dark:text-blue-300 2xl:text-lg">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      {topSubCategory[0]?.subcategory?.icon}
                    </TooltipTrigger>
                    <TooltipContent className="bg-light-700 dark:bg-dark-200 ">
                      <p>{topSubCategory[0]?.subcategory?.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>{" "}
                - {topSubCategory[0]?.totalAmount} €
              </span>{" "}
            </p>
          </div>

          <div
            className={`flex max-h-[100px] max-w-[350px]  items-center justify-end gap-4 self-end px-3 py-1 font-medium text-blue-700 dark:text-blue-300  2xl:max-w-[150px]`}
          >
            <LocalSearch
              route={"/expenses"}
              placeholder="Αναζήτηση"
              otherClasses="min-w-[140px] mb-4 border dark:border-slate-200 border-blue-400 max-w-[160px]"
            />
            <CreateExpenseDialog parentCategory={data} />
            <CreateCategoryDialog parentCategory={data} />

            <span className="mb-4 flex flex-row items-center gap-2 rounded-full bg-light-700 px-3 py-2 font-semibold text-black dark:text-blue-600 2xl:text-lg">
              {data?.subCategories.length}
            </span>

            <SubCategoryCarousel subCategories={data?.subCategories} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseInfo;
