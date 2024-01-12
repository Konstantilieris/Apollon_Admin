import Link from "next/link";
import React from "react";
import Image from "next/image";
interface CardProps {
  show: string; // the number Im showing
  title: string; // title of category
  navigation: string; // href for the button
  type?: string;
  icon?: string;
}
const DashCards = (props: CardProps) => {
  const { show, title, navigation } = props;
  return (
    <div className="card-wrapper text-dark200_light800  flex  w-full flex-col gap-4 rounded-lg p-4 font-noto_sans max-xs:min-w-full xs:w-[260px]">
      <div className="flex flex-row justify-between">
        <h2 className=" font-bold">{show}</h2>
        <Image
          src="/assets/icons/chart.svg"
          alt="icon"
          width={24}
          height={24}
          className="justify-end"
        />
      </div>
      <h1 className="subtle-medium ">{title}</h1>
      <Link
        href={navigation}
        className="flex w-full flex-row   gap-1 rounded-lg bg-black px-4 py-2"
      >
        <span className="flex-1 text-center text-white">Quickly Go To</span>
        <Image
          src="/assets/icons/arrow-right.svg"
          width={20}
          height={20}
          alt="arrow-right"
          className="self-end object-contain"
        />
      </Link>
    </div>
  );
};

export default DashCards;
