import { cn } from "@/lib/utils";
import React from "react";
const BottomGradient = ({ className }: { className?: string }) => {
  return (
    <>
      <span
        className={cn(
          "absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100",
          className
        )}
      />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};
export default BottomGradient;
