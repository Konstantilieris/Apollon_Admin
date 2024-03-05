import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn, formatDate, formatTime } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { Input } from "../ui/input";
import { CreateTransport } from "@/lib/actions/transportation.action";
interface Params {
  stage: any;
  setStage: any;
  dogs: any;

  timeArrival: Date;

  date: Date;
  client: any;
  notes?: string;
}
const TransportDialog = ({
  stage,
  setStage,
  dogs,

  timeArrival,

  date,
  client,
  notes,
}: Params) => {
  const path = usePathname();
  const { toast } = useToast();
  const [price, setPrice] = React.useState("0");

  const handleCreateTransport = async () => {
    try {
      const transport = await CreateTransport({
        clientId: client.id,
        price: parseInt(price),
        date,
        dogs,
        timeArrival: formatTime(timeArrival, "el"),

        notes,
        path,
      });

      if (transport) {
        toast({
          className: cn(
            "bg-celtic-green border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Επιτυχία",
          description: `Η μεταφορά για τον πελάτη ${client.lastName} δημιουργήθηκε`,
        });
      }
    } catch (error) {
      toast({
        className: cn(
          "bg-red-dark border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Αποτυχία",
        description: `${error}`,
      });
    } finally {
      setStage(false);
      window.location.reload();
    }
  };
  return (
    <AlertDialog open={stage} onOpenChange={setStage}>
      <AlertDialogContent className="text-dark200_light800 background-light850_dark100 flex  min-w-[400px] flex-col">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-noto_sans font-bold">
            Δημιούργια Ραντεβού Εκπαίδευσης
          </AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col gap-2">
            <span>
              Όνομα Πελάτη: {client.firstName} {client.lastName}
            </span>
            <span className="flex flex-col gap-2">
              Σκύλοι για μεταφορά απο {client.location.address}:{" "}
              {dogs.map((item: any) => {
                return <span key={item._id}>&bull; {item.name}</span>;
              })}
            </span>
            <span>
              {!date
                ? "Δεν εχέτε επιλέξει ημερές"
                : `Ημερομηνία : ${formatDate(date, "el")}.`}
            </span>
            <span>
              {!timeArrival
                ? "Δεν εχέτε επιλέξει ώρα μεταφοράς"
                : `Ώρα μεταφοράς : ${formatTime(timeArrival, "el")}`}
            </span>

            <span>Σημειώσεις : {notes}</span>
            <span>
              <Input
                type="number"
                className="background-light900_dark300 max-w-[100px] border-2 border-purple-500 font-noto_sans font-bold dark:border-blue-200"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </span>
            <span>Συνολική Τιμή {price}: Ευρώ</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-2 border-red-500">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="border-2 border-purple-500 dark:border-blue-200"
            onClick={() => handleCreateTransport()}
            disabled={price === "0" || price === "" || price === undefined}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TransportDialog;
