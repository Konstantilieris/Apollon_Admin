import React, { useEffect } from "react";
import { Textarea, Button } from "@heroui/react";

import { useRouter } from "next/navigation";
import { updateClientNote } from "@/lib/actions/client.action";
import { IClient } from "@/database/models/client.model";
import { useModalStore } from "@/hooks/client-profile-store";
import { useToast } from "@/components/ui/use-toast";

export default function ClientNoteForm() {
  const { modalData, closeModal } = useModalStore();
  const client = modalData.client as IClient;
  const [note, setNote] = React.useState(client.notes || "");
  const { toast } = useToast();
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
    if (!client._id) return;
    try {
      const res = await updateClientNote({ clientId: client._id, note });
      const updatedClient = JSON.parse(res);
      if (updatedClient) {
        router.refresh();
        setIsLoading(false);
        toast({
          title: "Επιτυχία",
          description: "Η σημείωση του πελάτη ενημερώθηκε επιτυχώς.",
          className: "bg-green-500 text-white",
        });
        closeModal();
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Σφάλμα",
        description: "Παρουσιάστηκε σφάλμα κατά την ενημέρωση της σημείωσης.",
        className: "bg-red-500 text-white",
      });
      closeModal();
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };

  return (
    <div className="flex h-full w-full max-w-md flex-col items-center justify-center space-y-4">
      <h1 className="text-center text-2xl font-bold">
        Σημείωση πελάτη {client?.name}
      </h1>
      <Textarea
        label="Σημείωση πελάτη"
        placeholder="Enter note content..."
        value={note}
        onValueChange={(value) => {
          setNote(value);
          setIsInvalid(false);
        }}
        isInvalid={isInvalid}
        errorMessage={isInvalid ? "Note content is required" : ""}
        minRows={4}
        variant="bordered"
        color="default"
      />
      <Button
        color="success"
        variant="bordered"
        onPress={handleSubmit}
        className="w-full"
      >
        {isLoading ? "Φορτώνει" : "Αποθήκευση"}
      </Button>
    </div>
  );
}
