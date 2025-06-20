import React, { useEffect } from "react";
import { Textarea, Button } from "@heroui/react";

import { useRouter } from "next/navigation";
import { updateClientNote } from "@/lib/actions/client.action";
import { IClient } from "@/database/models/client.model";
import { useModalStore } from "@/hooks/client-profile-store";
import { toast } from "sonner";

export default function ClientNoteForm() {
  const { modalData, closeModal } = useModalStore();
  const client = modalData?.client as IClient;
  const [note, setNote] = React.useState(client?.notes || "");

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
      const res = await updateClientNote({ clientId: client?._id, note });
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
  if (!client) return null;

  return (
    <div className="flex h-full w-full  flex-col items-center justify-center space-y-8">
      <h1 className="text-center text-2xl font-bold">
        Σημείωση πελάτη {client?.name}
      </h1>
      <Textarea
        label="Σημείωση πελάτη"
        placeholder="Enter note content..."
        value={note}
        className="max-w-6xl"
        classNames={{
          label: "text-lg font-semibold",
          description: "text-lg text-gray-500",
          errorMessage: "text-lg animate-pulse",
        }}
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
        className="max-w-6xl uppercase tracking-widest"
        isLoading={isLoading}
      >
        ΑΠΟΘΗΚΕΥΣΗ
      </Button>
    </div>
  );
}
