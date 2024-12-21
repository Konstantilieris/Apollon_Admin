"use client";
import { cn } from "@/lib/utils";

import React, { useId } from "react";
interface ClientWrapperProps {
  item: {
    icon: React.ElementType | any;
    value: string;
    description: string;
  };
  iconStyle?: string;
  isButton?: boolean;
  hasEuro?: boolean;
  className?: string;
  handleClick?: () => void;
}
export function CardWrapperClientRow({
  item,
  className,
  isButton = false,
  iconStyle,
  hasEuro = false,
  handleClick = undefined,
}: ClientWrapperProps) {
  return (
    <div
      className={cn(
        "group/card relative overflow-hidden  h-[105px]  w-[300px] ",

        "hover:border-b border-neutral-200 dark:border-yellow-900 md:hover:border-b-0 md:hover:border-r",
        className
      )}
      onClick={isButton ? handleClick : undefined}
    >
      <Grid size={20} />
      <EdgeElement />

      <div className="flex items-center gap-2">
        <IconContainer>
          <item.icon className={cn("text-white", iconStyle)} />
        </IconContainer>
        <p className="text-3xl font-bold text-neutral-700 dark:text-neutral-200">
          {item.value} {hasEuro && "€"}
        </p>
      </div>
      <p className="mt-4 text-base tracking-widest text-neutral-600 dark:text-neutral-300">
        {item.description}
      </p>
    </div>
  );
}

const EdgeElement = () => {
  return (
    <div className="absolute right-0 top-0 h-10 w-10 overflow-hidden border-b border-l bg-white shadow-[-3px_4px_9px_0px_rgba(0,0,0,0.14)] transition duration-200 group-hover/card:-translate-y-14 group-hover/card:translate-x-14 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-[-3px_4px_9px_0px_rgba(255,255,255,0.2)]">
      <div className="absolute left-0 top-0 h-[1px] w-[141%] origin-top-left rotate-45 bg-neutral-100 dark:bg-neutral-800" />
    </div>
  );
};
const IconContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-b from-neutral-200 to-[50%] p-1 dark:from-neutral-800 dark:to-black">
      <div className="flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-b from-[#5D5D5D] to-black dark:to-neutral-900">
        {children}
      </div>
    </div>
  );
};

export const Grid = ({
  pattern,
  size,
}: {
  pattern?: number[][];
  size: number;
}) => {
  const p = pattern ?? [
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
  ];
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-100/30 to-zinc-300/30 opacity-100 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-zinc-900/30 dark:to-zinc-900/30">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full fill-black/10 stroke-black/10 mix-blend-overlay dark:fill-white/10 dark:stroke-white/10"
        />
      </div>
    </div>
  );
};

export function GridPattern({
  width,
  height,
  x,
  y,
  squares,
  ...props
}: {
  width: number;
  height: number;
  x: number | string;
  y: number | string;
  squares: number[][];
} & React.SVGProps<SVGSVGElement>) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}
