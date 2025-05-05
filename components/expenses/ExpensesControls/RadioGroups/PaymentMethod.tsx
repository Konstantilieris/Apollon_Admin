"use client";
import { RadioGroup, Radio } from "@heroui/react";
import { useUrlPaymentMethodFilter } from "@/hooks/useUrlPaymentMethodFilter";

const PaymentMethod = () => {
  const { paymentMethodFilter, setPaymentMethodFilter } =
    useUrlPaymentMethodFilter();

  return (
    <RadioGroup
      label="Payment Method"
      value={paymentMethodFilter}
      onValueChange={setPaymentMethodFilter as any}
      color="secondary"
      className="font-sans tracking-wide"
    >
      <Radio value="all">Όλα</Radio>
      <Radio value="creditcard">Πιστωτική</Radio>
      <Radio value="cash">Μετρητά</Radio>
      <Radio value="bank">Τραπεζικό Έμβασμα</Radio>
    </RadioGroup>
  );
};

export default PaymentMethod;
