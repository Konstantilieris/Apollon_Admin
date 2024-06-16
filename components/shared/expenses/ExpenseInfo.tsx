"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

import SubCategoryCarousel from "./SubCategoryCarousel";

const ExpenseInfo = ({ data, mainId, totalSum = 0 }: any) => {
  return (
    <div
      className={cn(
        `category-info background-light850_dark100 shadow-sm border-white rounded-lg text-dark200_light900 font-noto_sans`
      )}
    >
      <figure className={`flex-center mt-4 h-fit rounded-full bg-blue-600`}>
        <Image
          src={data?.mainCategory.img}
          width={20}
          height={20}
          alt={data.mainCategory.name}
          className="m-2 w-5 "
        />
      </figure>
      <div className="flex w-full flex-1 flex-col justify-center gap-1">
        <div className="category-info_content">
          <div>
            <h2 className={` line-clamp-1 flex-1 font-bold  2xl:text-lg`}>
              {data.mainCategory.name}
            </h2>
            <p className={` text-center font-medium  `}>
              <span className="2xl:text-lg"> Σύνολο Εξόδων Κατηγορίας : </span>
              <span className="font-semibold text-red-500 dark:text-blue-300 2xl:text-lg">
                {totalSum} €
              </span>{" "}
            </p>
          </div>

          <div
            className={`flex max-h-[100px] max-w-[350px]  items-center justify-end gap-2 self-end px-3 py-1 font-medium text-blue-700 dark:text-blue-300 2xl:max-w-[150px]`}
          >
            <span className="mb-4 flex flex-row items-center gap-2 2xl:text-lg">
              Υποκατηγορίες
            </span>
            <span className="mb-4 flex flex-row items-center gap-2 rounded-full bg-light-700 px-3 py-2 font-semibold text-black dark:text-blue-600 2xl:text-lg">
              {data.mainCategory.subCategories.length}
            </span>

            <SubCategoryCarousel
              subCategories={data.mainCategory.subCategories}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseInfo;
