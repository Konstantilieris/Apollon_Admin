"use client";
import React, { RefObject, useRef, useState } from "react";
import { motion } from "framer-motion";
import { IconPlus } from "@tabler/icons-react";
import Carousel from "react-multi-carousel";
import { useOutsideClick2 } from "@/hooks/use-outside-click2";
import "react-multi-carousel/lib/styles.css";
import { pushTagOnClient } from "@/lib/actions/client.action";

import TagSelector from "./TagSelector";
import CustomArrow from "@/components/shared/expenses/CustomArrow";

const ClientTags = ({ clientTags, allTags, client }: any) => {
  const [showModal, setShowModal] = useState(false);
  const ref = useRef() as RefObject<HTMLDivElement>;

  const selectRef = useRef() as RefObject<HTMLDivElement>;
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [clientTagsValue, setClientTagsValue] = useState<string[]>(clientTags);
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };
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
    <div className="relative flex w-full max-w-[10vw] select-none items-center space-x-4 self-end rounded-lg bg-neutral-800 p-2">
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
          className="absolute left-0 top-12 z-50 flex  max-h-[50vh] min-w-[20vw] flex-col gap-2 overflow-y-hidden rounded-lg p-2 shadow-md dark:bg-dark-200/80"
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
      <Carousel
        containerClass=" flex w-full space-x-2 overflow-x-auto min-h-[5vh]"
        responsive={responsive}
        infinite={false}
        dotListClass="flex justify-center mt-4"
        customLeftArrow={<CustomArrow direction="left" />}
        customRightArrow={<CustomArrow direction="right" />}
        renderDotsOutside
      >
        {clientTagsValue.map((tag: string, index: number) => (
          <div
            key={index}
            className="flex min-h-[5vh]  min-w-[4vw] items-center justify-center truncate  rounded-full bg-dark-300 py-1  text-[0.7rem] text-white"
          >
            {tag}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ClientTags;
