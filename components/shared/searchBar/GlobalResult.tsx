import React, { useEffect, useRef, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";
import { globalSearch } from "@/lib/actions/client.action";
import { motion } from "framer-motion";
import Image from "next/image";
import { GlobalSearchFilters } from "@/lib/utils";
import { Separator } from "@radix-ui/react-dropdown-menu";
import ResultButton from "./ButtonResult";
import { IconDog, IconTool } from "@tabler/icons-react";
interface Props {
  setIsOpen: (state: boolean) => void;
}

const GlobalResult = ({ setIsOpen }: Props) => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const global = searchParams.get("global");
  const resultRef = useRef(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Abort previous request if a new search starts
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController for the latest request
    abortControllerRef.current = new AbortController();
    const controller = abortControllerRef.current; // Store in local variable

    const fetchResults = async () => {
      if (!global) return;

      setIsLoading(true);

      try {
        const res = await globalSearch({ query: global });

        if (!controller.signal.aborted) {
          setResults(JSON.parse(res)); // ✅ Only update state if request was NOT aborted
        }
      } catch (error: any) {
        if (error.name !== "AbortError") console.error(error);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchResults();

    return () => {
      controller.abort(); // Abort request on cleanup
    };
  }, [global]);

  return (
    <motion.div
      ref={resultRef}
      className="mt-3 h-full min-h-[100px] w-full  overflow-hidden border-t border-gray-300  font-sans dark:border-gray-700 "
    >
      {isLoading ? (
        <div className="flex h-full items-center justify-center p-4">
          <ReloadIcon className="h-6 w-6 animate-spin text-yellow-600" />
          <p className="text-dark200_light800 body-regular">
            Browsing the entire database
          </p>
        </div>
      ) : results.length > 0 ? (
        results.map((result, index) => (
          <>
            <motion.div
              key={index}
              className="   rounded-lg border-b border-gray-200 px-4 py-3  hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-slate-900/40 "
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
              <div className="flex w-full flex-row items-center gap-2  ">
                <div className="flex w-full flex-row items-center justify-between ">
                  <div className="body-medium flex flex-col gap-2">
                    <p className=" text-dark200_light800 flex items-center gap-2 text-lg">
                      <Image
                        src="/assets/icons/client.svg"
                        alt="tags"
                        width={24}
                        height={24}
                        className=" object-contain invert dark:invert-0"
                      />
                      {result?.name}
                    </p>

                    <span className="flex flex-row items-center gap-2  text-sm text-gray-400 ">
                      <IconTool /> {result?.profession ?? "μη διαθέσιμο"}
                    </span>
                    <span className="flex min-w-[8vw] flex-row gap-2  text-sm text-gray-400">
                      <IconDog />{" "}
                      {result?.dog.map((dog: any) => dog?.name).join(", ")}
                    </span>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    {GlobalSearchFilters.map((item) => (
                      <ResultButton
                        setIsOpen={setIsOpen}
                        key={item.value}
                        item={item}
                        result={result}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
            {index !== result.length - 1 && (
              <Separator className="w-full bg-gray-900" />
            )}
          </>
        ))
      ) : (
        <div className="p-4 text-center text-gray-500">No results found.</div>
      )}
    </motion.div>
  );
};

export default GlobalResult;
