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
    <>
      <Image
        src={"/assets/icons/skeleton.svg"}
        className={animation}
        alt="skeleton"
        width={size}
        height={size}
      />
    </>
  );
};

export default LoadingSkeleton;
