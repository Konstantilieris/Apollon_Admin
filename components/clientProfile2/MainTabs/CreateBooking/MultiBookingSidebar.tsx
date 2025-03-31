"use client";

import React from "react";
import { Button, cn } from "@heroui/react";
import { Icon } from "@iconify/react";
import VerticalSteps from "@/components/createClient/vertical-steps";
import RowSteps from "@/components/createClient/row-steps";

export type MultiStepSidebarProps = React.HTMLAttributes<HTMLDivElement> & {
  currentPage: number;
  onBack: () => void;
  onNext: () => void;
  onChangePage: (page: number) => void;
};

const stepperClasses = cn(
  // light
  "[--step-color:hsl(var(--heroui-secondary-400))]",
  "[--active-color:hsl(var(--heroui-secondary-400))]",
  "[--inactive-border-color:hsl(var(--heroui-secondary-200))]",
  "[--inactive-bar-color:hsl(var(--heroui-secondary-200))]",
  "[--inactive-color:hsl(var(--heroui-secondary-300))]",
  // dark
  "dark:[--step-color:rgba(255,255,255,0.1)]",
  "dark:[--active-color:hsl(var(--heroui-foreground-600))]",
  "dark:[--active-border-color:rgba(255,255,255,0.5)]",
  "dark:[--inactive-border-color:rgba(255,255,255,0.1)]",
  "dark:[--inactive-bar-color:rgba(255,255,255,0.1)]",
  "dark:[--inactive-color:rgba(255,255,255,0.2)]"
);

const MultiStepSidebar = React.forwardRef<
  HTMLDivElement,
  MultiStepSidebarProps
>(
  (
    {
      children,
      className,
      currentPage,
      onBack,
      onNext,
      onChangePage,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("flex h-[calc(100vh_-_40px)] w-full gap-x-2", className)}
        {...props}
      >
        <div className="hidden h-full w-[344px] shrink-0 flex-col items-start gap-y-8 rounded-large bg-gradient-to-b from-default-100 via-danger-100 to-secondary-100 px-8 py-6 shadow-small lg:flex">
          <Button
            className="bg-default-50 text-small font-medium text-default-500 shadow-lg"
            isDisabled={currentPage === 0 || currentPage === 3}
            radius="full"
            variant="flat"
            onPress={onBack}
          >
            <Icon icon="solar:arrow-left-outline" width={18} />
            Πίσω
          </Button>
          <div>
            <div className="text-xl font-medium leading-7 text-default-foreground">
              Δημιουργία Κράτησης
            </div>
            <div className="mt-1 text-base font-medium leading-6 text-default-500">
              Συμπληρώστε τα απαραίτητα στοιχεία για την κράτηση του πελάτη
            </div>
          </div>
          {/* Desktop Steps */}
          <VerticalSteps
            className={stepperClasses}
            color={"secondary"}
            currentStep={currentPage}
            steps={[
              {
                title: "Επιλογή Ημερομηνίας",
                description: "Επιλέξτε την ημερομηνία που επιθυμείτε",
              },
              {
                title: "Επιλογή Δωματίου",
                description: "Επιλέξτε το δωμάτιο που επιθυμείτε",
              },
              {
                title: "Επιτυχία",
                description: "Επιτυχής Δημιουργία Κράτησης",
              },
            ]}
          />
        </div>
        <div className="flex h-full w-full flex-col items-center gap-4 md:p-4">
          <div className="sticky top-0 z-10 w-full rounded-large bg-gradient-to-r from-default-100 via-danger-100 to-secondary-100 py-4 shadow-small md:max-w-xl lg:hidden">
            <div className="flex w-full justify-center">
              {/* Mobile Steps */}
              <RowSteps
                className={cn("pl-6", stepperClasses)}
                currentStep={currentPage}
                steps={[
                  {
                    title: "Επιλογή Ημερομηνίας",
                  },
                  {
                    title: "Επιλογή Δωματίου",
                  },

                  {
                    title: "Επιτυχία",
                  },
                ]}
                onStepChange={onChangePage}
              />
            </div>
          </div>
          <div className="max-h-screen w-full overflow-y-auto p-4 ">
            {children}
          </div>
        </div>
      </div>
    );
  }
);

MultiStepSidebar.displayName = "MultiStepSidebar";

export default MultiStepSidebar;
