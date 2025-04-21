import React, { useEffect, useRef } from "react";
import { Card, CardBody, Button, Spinner, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { globalSearch } from "@/lib/actions/client.action";
import { useRouter } from "next/navigation";

interface ResultButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
}

const ResultButton = ({ icon, label, onClick }: ResultButtonProps) => (
  <Button
    size="sm"
    variant="flat"
    color="primary"
    onPress={onClick}
    className="text-base hover:text-purple-700"
    startContent={<Icon icon={icon} width={20} height={20} />}
  >
    {label}
  </Button>
);

interface GlobalResultProps {
  setIsOpen: (state: boolean) => void;
  searchTerm: string;
  clearSearchTerm: () => void;
}

export const GlobalResult = ({
  setIsOpen,
  searchTerm,
  clearSearchTerm,
}: GlobalResultProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<any[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const router = useRouter();
  useEffect(() => {
    // Abort previous request if a new search starts
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController for the latest request
    abortControllerRef.current = new AbortController();
    const controller = abortControllerRef.current; // Store in local variable

    const fetchResults = async () => {
      if (!searchTerm) return;

      setIsLoading(true);

      try {
        const res = await globalSearch({ query: searchTerm });

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
  }, [searchTerm]);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 font-sans">
        <Spinner color="primary" />
        <span className="ml-2 text-default-500">Searching...</span>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="p-8 text-center font-sans tracking-widest text-default-500">
        Κανένα αποτέλεσμα
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2 font-sans">
      {results.map((result, index) => (
        <motion.div
          key={result._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="w-full ">
            <CardBody className="flex flex-row items-center justify-between p-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">{result.name}</h3>
                <div className="flex items-center gap-2 text-default-500">
                  <Icon icon="lucide:briefcase" width={16} height={16} />
                  <span>{result.profession}</span>
                </div>
                <div className="flex items-center gap-2 text-default-500">
                  <Icon icon="lucide:dog" width={16} height={16} />
                  {result?.dog.map((dog: any) => dog?.name).join(", ")}
                </div>
              </div>
              <div className="flex gap-2">
                <ResultButton
                  icon="lucide:user"
                  label="Προφίλ"
                  onClick={() => {
                    router.push(`/client/${result._id}?tab=Info`);
                    setIsOpen(false);
                    clearSearchTerm();
                  }}
                />
                <ResultButton
                  icon="lucide:calendar"
                  label="Κράτηση"
                  onClick={() => {
                    router.push(`/client/${result._id}?tab=booking`);
                    setIsOpen(false);
                    clearSearchTerm();
                  }}
                />
                <ResultButton
                  icon="lucide:credit-card"
                  label="Υπηρεσίες"
                  onClick={() => {
                    router.push(`/client/${result._id}?tab=Financial`, {});
                    setIsOpen(false);
                    clearSearchTerm();
                  }}
                />
              </div>
            </CardBody>
          </Card>
          {index < results.length - 1 && <Divider className="my-2" />}
        </motion.div>
      ))}
    </div>
  );
};
