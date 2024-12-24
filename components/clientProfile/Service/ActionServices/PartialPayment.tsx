"use client";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { partialPayment } from "@/lib/actions/service.action";
import { formatDate } from "@/lib/utils";
import { IconLoader } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import React from "react";

const PartialPayment = ({ client }: { client: any }) => {
  const [amount, setAmount] = React.useState<string | null>("0");
  const [loading, setLoading] = React.useState(false);
  const path = usePathname();
  const { toast } = useToast();
  const handlePartialPayment = async () => {
    setLoading(true);
    try {
      const res = await partialPayment({
        clientId: client.client._id,
        amount: parseFloat(amount ?? "0"),
        path,
      });
      if (res.success) {
        toast({
          title: "Επιτυχία",
          description: "Η εξόφληση ολοκληρώθηκε",
          className:
            "bg-celtic-green border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed font-sans ",
        });
      }
    } catch (error) {
      console.error("Error charging client:", error);
    } finally {
      window.location.reload();
      setLoading(false);
    }
  };
  return (
    <div className="flex h-full w-full flex-col  items-center gap-8 px-4 py-8">
      <h1 className=" self-start text-2xl">Μερική Εξόφληση</h1>
      <div className="flex w-full flex-row justify-between px-4 text-lg">
        <p className="text-light-900">Όνομα: {client?.client?.name}</p>
        <p className="text-light-900">
          Τηλέφωνο: {client?.client?.phone.mobile}
        </p>
      </div>
      <div className="flex w-full flex-row justify-between px-4 text-lg">
        <p className="text-light-900">
          Ημερομηνία: {formatDate(new Date(), "el")}
        </p>
        <p className="text-light-900">Υπόλοιπο: {client?.client?.owesTotal}€</p>
      </div>

      <div className=" flex h-full  flex-col items-center justify-center gap-8 px-8">
        <span className="text-xl">
          Εισάγετε το ποσό που θέλετε να εξοφλήσετε
        </span>
        <Input
          className=" z-[9999] max-w-[20vw] text-light-900 placeholder:text-blue-500 focus:outline-none"
          placeholder="Ποσό"
          type="number"
          value={amount ?? "0"}
          onChange={(e) => setAmount(e.target.value)}
        />
        <span className=" ml-2 flex flex-row self-start text-sm text-blue-500">
          {amount || "0"}€{" "}
        </span>
      </div>
      <button
        className="w-full max-w-[20vw] rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        onClick={handlePartialPayment}
        disabled={parseFloat(amount ?? "0") <= 0 || loading}
      >
        {loading ? (
          <IconLoader className="animate-spin" size={24} />
        ) : (
          "Εξόφληση"
        )}
      </button>
    </div>
  );
};

export default PartialPayment;
