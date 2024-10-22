import React from "react";
import Image from "next/image";
const LoadingSkeleton = ({
  size,
  animation,
}: {
  size: number;
  animation?: string | "";
}) => {
  return (
    <div className="flex  h-full w-full items-center justify-center">
      <Image
        src={"/assets/icons/skeleton.svg"}
        className={animation}
        priority
        alt="skeleton"
        width={size}
        height={size}
      />
    </div>
  );
};

export default LoadingSkeleton;
