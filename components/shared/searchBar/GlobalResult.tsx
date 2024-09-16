"use client";
import React, { useEffect, useRef, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import GlobalFilters from "./GlobalFilters";
import { globalSearch } from "@/lib/actions/client.action";
import { AnimationControls, motion } from "framer-motion";

import { useOutsideClick2 } from "@/hooks/use-outside-click2";

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

  const renderLink = (type: string | null, id: string) => {
    switch (type) {
      case "client":
        return `/clients/${id}`;
      case "booking":
        return `/clients/${id}/book`;
      case "training":
        return `/training/${id}`;

      default:
        return `/clients/${id}`;
    }
  };
  useOutsideClick2([resultRef, searchRef], () => {
    control.start("hidden");
    controlSearch.start("hidden");
    setStage(false);
  });

  return (
    <motion.div
      className="z-50  mt-3 w-full min-w-[60vw] rounded-xl border border-light-700 bg-light-800 px-4 py-5 shadow-sm dark:bg-neutral-950"
      ref={resultRef}
    >
      <GlobalFilters />
      <div className="my-5 h-[1px] bg-light-700/50 dark:bg-dark-500/50" />

      <div className="space-y-5">
        <p className="text-dark400_light900 paragraph-semibold px-5 text-lg">
          Κορυφαίες Αντιστοιχίες
        </p>

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
              client.map((client: any, index: number) => (
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
                  <Link
                    href={renderLink(type, client?._id)}
                    className="flex w-full flex-row items-center gap-2"
                  >
                    <Image
                      src="/assets/icons/client.svg"
                      alt="tags"
                      width={28}
                      height={24}
                      className="mb-1 object-contain invert dark:invert-0"
                    />

                    <div className="flex w-full flex-col">
                      <p className="body-medium text-dark200_light800 line-clamp-1">
                        {client?.name}
                      </p>
                      <div className="flex w-full flex-row items-center justify-between">
                        <p className="text-light400_light500 small-medium mt-1 font-bold capitalize">
                          {client?.dog.map((dog: any) => dog?.name).join(", ")}
                        </p>
                        <p className="small-medium mt-1 font-bold capitalize text-yellow-500">
                          {client?.profession}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
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
