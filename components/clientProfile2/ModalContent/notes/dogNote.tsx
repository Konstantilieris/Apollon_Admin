import React, { useEffect } from "react";
import { Textarea, Button } from "@heroui/react";

import { useRouter } from "next/navigation";
import { updateClientDogNote } from "@/lib/actions/client.action";

import { useModalStore } from "@/hooks/client-profile-store";
import { toast } from "sonner";

export default function DogNoteForm() {
  const { modalData, closeModal } = useModalStore();
  const clientId = modalData?.clientId as string;
  const dog = modalData?.dog as any;
  const [note, setNote] = React.useState(dog?.note || "");

  const [isLoading, setIsLoading] = React.useState(false);
  const [isInvalid, setIsInvalid] = React.useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!note || note === "") {
      setIsInvalid(true);
    }
  }, [note]);
  const handleSubmit = async () => {
    setIsLoading(true);
    if (!clientId) return;
    try {
      const res = await updateClientDogNote({
        clientId,
        note,
        dogId: dog._id,
      });
      const updatedClient = JSON.parse(res);
      if (updatedClient) {
        router.refresh();
        setIsLoading(false);
        toast.success("Η σημείωση ενημερώθηκε επιτυχώς!");
        closeModal();
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Η ενημέρωση της σημείωσης απέτυχε!");
      closeModal();
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };
  console.log("MODALDATA", modalData);

  return (
    <div className=" flex h-full w-full  flex-col items-center justify-center  space-y-8 ">
      <h1 className="text-center text-2xl font-bold tracking-widest">
        Σημείωση Σκύλου {dog?.name}
      </h1>
      <Textarea
        label="Σημείωση Κατοικιδίου"
        placeholder="Γράψτε εδώ τη σημείωση σας..."
        classNames={{
          label: "text-lg font-semibold",
          description: "text-lg text-gray-500",
          errorMessage: "text-lg animate-pulse",
        }}
        value={note}
        className="max-w-6xl"
        onValueChange={(value) => {
          setNote(value);
          setIsInvalid(false);
        }}
        isInvalid={isInvalid}
        errorMessage={isInvalid ? "Η σημέιωση είναι κενή" : ""}
        minRows={4}
        variant="bordered"
        color="default"
      />
      <Button
        color="success"
        variant="bordered"
        onPress={handleSubmit}
        className="max-w-6xl uppercase tracking-widest"
        size="lg"
        isDisabled={isLoading || isInvalid}
        isLoading={isLoading}
      >
        Αποθηκευση
      </Button>
    </div>
  );
}
