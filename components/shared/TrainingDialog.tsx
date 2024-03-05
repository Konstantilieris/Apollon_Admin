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
import { CreateTraining } from "@/lib/actions/training.action";
const TrainingDialog = ({
  stage,
  setStage,
  dogs,
  totalprice,
  timeArrival,
  timeDeparture,
  date,
  client,
  name,
  notes,
  setIsSubmitting,
}: any) => {
  const path = usePathname();
  const { toast } = useToast();

  const handleCreateTraining = async () => {
    try {
      const training = await CreateTraining({
        name,
        clientId: client.id,
        price: totalprice,
        date,
        dogs,
        timeArrival: formatTime(timeArrival, "el"),
        timeDeparture: formatTime(timeDeparture, "el"),
        notes,
        path,
      });
      if (training) {
        toast({
          className: cn(
            "bg-celtic-green border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Επιτυχία",
          description: `Η εκπαίδευση για τον πελάτη ${client.lastName} δημιουργήθηκε`,
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
      setStage(0);
      setIsSubmitting(false);
      window.location.reload();
    }
  };
  return (
    <AlertDialog
      open={stage === 2}
      onOpenChange={() => {
        setStage(0);
        setIsSubmitting(false);
      }}
    >
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
              Σκύλοι για εκπαίδευση :
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
                ? "Δεν εχέτε επιλέξει ώρα άφιξης"
                : `Ώρα άφιξης : ${formatTime(timeArrival, "el")}`}
            </span>
            <span className="flex flex-row items-center gap-2">
              {!timeDeparture
                ? "Δεν εχέτε επιλέξει ώρα αναχώρησης"
                : `Ώρα αναχώρησης : ${formatTime(timeDeparture, "el")}.`}
            </span>
            <span>Σημειώσεις : {notes}</span>
            <span>Συνολική Τιμή : {totalprice} Ευρώ</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-2 border-red-500">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="border-2 border-purple-500 dark:border-blue-200"
            onClick={handleCreateTraining}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TrainingDialog;
