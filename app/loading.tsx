import React from "react";
import LoadingSkeleton from "@/components/shared/skeletons/LoadingSkeleton";

const loading = () => {
  return (
    <div className="flex h-full  w-full items-center justify-center bg-dark-100  ">
      <LoadingSkeleton size={200} animation="animate-pulse" />
    </div>
  );
};

export default loading;
