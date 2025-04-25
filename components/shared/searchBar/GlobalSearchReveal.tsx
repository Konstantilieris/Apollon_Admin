"use client";
import React from "react";

import { Input, Modal, ModalContent, ModalBody } from "@heroui/react";

import { GlobalResult } from "./GlobalResult";

export const FloatingSearch = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const debounceTimer = React.useRef<any | null>(null);
  const isThrottled = React.useRef(false);

  React.useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.shiftKey && ["Z", "z", "Ζ", "ζ"].includes(event.key)) {
        event.preventDefault();

        if (!isThrottled.current) {
          setIsOpen((prev) => !prev);
          isThrottled.current = true;

          setTimeout(() => {
            isThrottled.current = false;
          }, 30);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      // Implement your search logic here
      console.log("Searching for:", value);
    }, 300);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setSearchTerm("");
        }
      }}
      size="4xl"
      backdrop="blur"
      placement="top"
      className="mt-8"
    >
      <ModalContent>
        {(onClose) => (
          <ModalBody className="p-4">
            <div className="flex w-full items-center gap-2 px-4 py-2">
              <Input
                label="Αναζήτηση"
                value={searchTerm}
                onValueChange={handleSearch}
                variant="bordered"
                color="secondary"
                size="lg"
                autoFocus
                classNames={{
                  label: "font-sans tracking-widest",
                  input: "font-sans",
                }}
              />
            </div>
            <GlobalResult
              setIsOpen={setIsOpen}
              searchTerm={searchTerm}
              clearSearchTerm={() => setSearchTerm("")}
            />
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};
