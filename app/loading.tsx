import React from "react";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";

const loading = () => {
  return (
    <div className="flex-center  background-light700_dark400 flex h-screen w-full flex-col gap-8 ">
      <div className="mt-8  flex flex-row justify-center">
        <LoadingSkeleton size={200} animation="animate-spin" />
      </div>
    </div>
  );
};

export default loading;
