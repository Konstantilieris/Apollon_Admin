"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const ConstantModal = dynamic(
  () => import("@/components/shared/constantManagement/ConstantModal"),
  {
    ssr: false,
  }
);
export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <>
      <ConstantModal />
    </>
  );
};
