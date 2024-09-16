"use client";
import React, { RefObject, useRef, useState } from "react";
import { motion } from "framer-motion";
import { IconPlus } from "@tabler/icons-react";

import { useOutsideClick2 } from "@/hooks/use-outside-click2";

import { pushTagOnClient } from "@/lib/actions/client.action";
import { usePathname } from "next/navigation";
import TagSelector from "./TagSelector";
const ClientTags = ({ clientTags, allTags, client }: any) => {
  const [showModal, setShowModal] = useState(false);
  const ref = useRef() as RefObject<HTMLDivElement>;
  const path = usePathname();
  const selectRef = useRef() as RefObject<HTMLDivElement>;
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [clientTagsValue, setClientTagsValue] = useState<string[]>(clientTags);
  const modalVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  };
  useOutsideClick2([ref, selectRef], () => {
    setShowModal(false);
    setSelectedTag(null);
  });
  const handleAddTag = async () => {
    if (!selectedTag) return;

    // Save the previous state for rollback in case of failure
    const previousTags = [...clientTagsValue];

    try {
      // Optimistically update the UI
      setClientTagsValue([...clientTagsValue, selectedTag]);

      // Close the modal and reset the input
      setShowModal(false);
      setSelectedTag(null);

      // Make the API call to update the server
      await pushTagOnClient({
        clientId: client._id,
        tag: selectedTag,
      });
    } catch (error) {
      // If the request fails, rollback the optimistic update
      console.error("Failed to add tag, reverting changes:", error);
      setClientTagsValue(previousTags);
    }
  };

  return (
    <div className="relative flex w-full items-center space-x-4 rounded-lg bg-[#240046] p-2 max-w-[10vw] self-end">
      {/* Plus Icon for adding a tag */}
      <IconPlus
        className="cursor-pointer text-white"
        onClick={() => setShowModal(true)}
      />

      {/* Modal using Framer Motion */}
      {showModal && (
        <motion.div
          ref={ref}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
          transition={{ duration: 0.3 }}
          className="absolute left-0 top-12 z-50 flex  flex-col gap-2 rounded-lg px-2 py-2 shadow-md dark:bg-dark-200/80 min-w-[20vw] max-h-[50vh] overflow-y-hidden "
        >
          <TagSelector
            items={allTags.value}
            selectedItem={selectedTag}
            setSelectedItem={setSelectedTag}
            type={"Tags"}
            label={"Tag"}
            placeholder={"Βρές το tag"}
            heading={""}
            handleSelectTag={handleAddTag}
          />
        </motion.div>
      )}

      {/* Carousel for displaying tags */}
      <div className="no-scrollbar flex space-x-2 overflow-x-auto w-full">
        {clientTagsValue.map((tag: string, index: number) => (
          <div
            key={index}
            className="whitespace-nowrap rounded-full bg-purple-600 px-4 py-1 text-white uppercase "
          >
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientTags;
