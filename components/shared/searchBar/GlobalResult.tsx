"use client";
import React, { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import GlobalFilters from "./GlobalFilters";
import { globalSearch } from "@/lib/actions/client.action";

const GlobalResult = () => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [client, setClient] = useState<any>([]);

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

  const renderLink = (type: string, id: string) => {
    switch (type) {
      case "client":
        return `/clients/${id}`;
      case "booking":
        return `/booking/${id}`;
      case "training":
        return `/training/${id}`;

      default:
        return "/";
    }
  };

  return (
    <div className="  fixed inset-x-[-20vw] top-12 z-50 mx-auto  mt-3 w-full min-w-[400px] rounded-xl border border-light-700 bg-light-800 px-4 py-5 shadow-sm dark:bg-dark-300">
      <GlobalFilters />
      <div className="my-5 h-[1px] bg-light-700/50 dark:bg-dark-500/50" />

      <div className="space-y-5">
        <p className="text-dark400_light900 paragraph-semibold px-5">
          Κορυφαίες Αντιστοιχίες
        </p>

        {isLoading ? (
          <div className="flex-center flex-col px-5">
            <ReloadIcon className="my-2 h-10 w-10 animate-spin text-primary-500" />
            <p className="text-dark200_light800 body-regular">
              Browsing the entire database
            </p>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-2">
            {client.length > 0 ? (
              client.map((client: any, index: number) => (
                <Link
                  key={index}
                  className="flex flex-row items-center gap-2 hover:scale-105"
                  href={renderLink(type || "client", client._id)}
                >
                  <Image
                    src="/assets/icons/client.svg"
                    alt="tags"
                    width={28}
                    height={24}
                    className="mb-1 object-contain"
                  />

                  <div className="flex w-full flex-col">
                    <p className="body-medium text-dark200_light800 line-clamp-1">
                      {client?.name}
                    </p>
                    <div className="flex w-full flex-row items-center justify-between">
                      <p className="text-light400_light500 small-medium mt-1 font-bold capitalize">
                        {client?.dog.map((dog: any) => dog?.name).join(", ")}
                      </p>
                      <p className="small-medium mt-1 font-bold capitalize text-orange-400">
                        {client?.profession}
                      </p>
                    </div>
                  </div>
                </Link>
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
    </div>
  );
};

export default GlobalResult;
