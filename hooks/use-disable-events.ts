import React, { useEffect } from "react";

export const useDisableEventsForRef = (
  ref: React.RefObject<HTMLElement>,
  isModalOpen: boolean
) => {
  useEffect(() => {
    if (isModalOpen && ref.current) {
      const disableEvents = (e: Event) => {
        e.stopPropagation();
        e.preventDefault();
      };

      // Disable specific events on the ref when the modal is open
      const currentElement = ref.current;
      currentElement.addEventListener("click", disableEvents, true);
      currentElement.addEventListener("mousedown", disableEvents, true);
      currentElement.addEventListener("touchstart", disableEvents, true);

      return () => {
        currentElement.removeEventListener("click", disableEvents, true);
        currentElement.removeEventListener("mousedown", disableEvents, true);
        currentElement.removeEventListener("touchstart", disableEvents, true);
      };
    }
  }, [isModalOpen, ref]);
};
