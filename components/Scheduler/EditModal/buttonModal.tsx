import BottomGradient from "@/components/ui/bottom-gradient";
import { cn } from "@/lib/utils";
import React from "react";
interface ButtonProps {
  gradientColor: string;
  containerStyle?: string;
  title: string | React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}
const ButtonModal = ({
  gradientColor,
  containerStyle,
  title,
  onClick,
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group/btn  relative mt-4  rounded-lg bg-dark-300 px-8 py-2 text-lg font-semibold tracking-widest text-yellow-500 transition hover:bg-dark-100",
        containerStyle
      )}
      disabled={disabled}
    >
      <BottomGradient className={gradientColor} />
      {title}
    </button>
  );
};

export default ButtonModal;
