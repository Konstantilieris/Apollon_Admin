import React from "react";
import LoadingSkeleton from "@/components/shared/skeletons/LoadingSkeleton";

const loading = () => {
  return (
    <div className="background-light700_dark400 flex  h-full w-full items-center justify-center  ">
      <LoadingSkeleton size={200} animation="animate-pulse" />
    </div>
  );
};

export default loading;
