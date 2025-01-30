"use client";
import { useRouter } from "next/navigation";
import React from "react";

const ResultButton = ({ item, result, setIsOpen }: any) => {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        if (item.value === "clients") {
          router.push(`/clients/${result._id}`);
          setIsOpen(false);
        } else if (item.value === "booking") {
          router.push(`/clients/${result._id}/book`);
          setIsOpen(false);
        } else {
          router.push(`/clients/${result._id}/service`);
          setIsOpen(false);
        }
      }}
      className="group relative inline-block cursor-pointer rounded-full  p-px font-semibold leading-6 text-white no-underline shadow-2xl  "
    >
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute inset-0 rounded-full bg-dark-200 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </span>
      <div className="relative z-10 flex items-center space-x-2 rounded-full px-4 py-0.5 ring-1 ring-white/10 ">
        <span className=" p-1 text-[1rem] tracking-widest">{item.name}</span>
        <svg
          fill="none"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.75 8.75L14.25 12L10.75 15.25"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </div>
      <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-gray-400/0 via-gray-400 to-gray-400/0 transition-opacity duration-500 group-hover:opacity-40" />
    </button>
  );
};

export default ResultButton;
