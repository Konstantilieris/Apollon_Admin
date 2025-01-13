"use client";
import React, { useEffect, useRef, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useSearchParams, useRouter } from "next/navigation";

import Image from "next/image";

import { globalSearch } from "@/lib/actions/client.action";
import { AnimationControls, motion } from "framer-motion";

import { useOutsideClick2 } from "@/hooks/use-outside-click2";
import { GlobalSearchFilters } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface Props {
  control: AnimationControls;
  setStage: (stage: boolean) => void;
  controlSearch: AnimationControls;
  searchRef: any;
}
const GlobalResult = ({
  control,
  setStage,
  controlSearch,
  searchRef,
}: Props) => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [client, setClient] = useState<any>([]);
  const resultRef = useRef(null);
  const global = searchParams.get("global");
  const type = searchParams.get("type");
  const router = useRouter();
  useEffect(() => {
    const fetchResult = async () => {
      setClient([]);
      setIsLoading(true);
      try {
        const res = await globalSearch({ query: global });
        setClient(JSON.parse(res));
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (global) {
      fetchResult();
    }
  }, [global, type]);

  useOutsideClick2([resultRef, searchRef], () => {
    control.start("hidden");
    controlSearch.start("hidden");
    setStage(false);
  });

  return (
    <motion.div
      className="z-50  mt-3 w-full min-w-[60vw] select-none rounded-xl border border-light-700 bg-light-800 px-4 py-5 shadow-sm dark:bg-neutral-950"
      ref={resultRef}
    >
      <div className="space-y-5">
        <p className="text-dark400_light900 paragraph-semibold px-5 text-lg">
          Κορυφαίες Αντιστοιχίες
        </p>
        <Separator className="w-full bg-gray-900" />

        {isLoading ? (
          <div className="flex-center flex-col px-5">
            <ReloadIcon className="my-2 h-10 w-10 animate-spin text-yellow-600" />
            <p className="text-dark200_light800 body-regular">
              Browsing the entire database
            </p>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-6">
            {client.length > 0 ? (
              client.map((result: any, index: number) => (
                <>
                  <motion.div
                    key={index}
                    className=" px-6"
                    whileHover={{ scale: 1.02 }}
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1 },
                    }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1,
                      ease: "easeInOut",
                    }}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="flex w-full flex-row items-center gap-2">
                      <Image
                        src="/assets/icons/client.svg"
                        alt="tags"
                        width={28}
                        height={24}
                        className="mb-1 object-contain invert dark:invert-0"
                      />

                      <div className="flex w-full flex-col">
                        <div className="flex w-full flex-row justify-between">
                          <p className="body-medium text-dark200_light800 line-clamp-1">
                            {result?.name}
                          </p>
                          <p className="small-medium  flex flex-row gap-2  self-end font-bold capitalize text-yellow-500">
                            {GlobalSearchFilters.map((item, i) => (
                              <button
                                key={item.name + i}
                                onClick={() => {
                                  if (item.value === "clients") {
                                    router.push(`/clients/${result._id}`);
                                  } else if (item.value === "booking") {
                                    router.push(`/clients/${result._id}/book`);
                                  } else {
                                    router.push(
                                      `/clients/${result._id}/service`
                                    );
                                  }
                                }}
                                className="group relative inline-block cursor-pointer rounded-full bg-slate-800 p-px font-semibold leading-6 text-white no-underline shadow-2xl  shadow-zinc-900 hover:text-yellow-500"
                              >
                                <span className="absolute inset-0 overflow-hidden rounded-full">
                                  <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                </span>
                                <div className="relative z-10 flex items-center space-x-2 rounded-full bg-zinc-950 px-4 py-0.5 ring-1 ring-white/10 ">
                                  <span className="py-1 text-[1rem]">
                                    {item.name}
                                  </span>
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
                                <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-yellow-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
                              </button>
                            ))}
                          </p>
                        </div>
                        <div className="flex w-full flex-row items-center justify-between pl-2">
                          <p className="text-light400_light500 small-medium mt-1 flex flex-row gap-4 font-bold capitalize">
                            <span className="flex min-w-[8vw] flex-row">
                              {result?.dog
                                .map((dog: any) => dog?.name)
                                .join(", ")}
                            </span>
                            <span className="text-yellow-500">
                              {result?.profession}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  {index !== client.length - 1 && (
                    <Separator className="w-full bg-gray-900" />
                  )}
                </>
              ))
            ) : (
              <div className="flex-center flex-col px-5">
                <p className="text-dark200_light800 body-regular px-5 py-2.5">
                  Ωχ, δεν βρέθηκαν αποτελέσματα
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GlobalResult;
