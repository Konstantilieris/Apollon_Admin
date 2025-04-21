import { toast } from "sonner";
import { useModalStore } from "@/hooks/client-profile-store";
import { deleteClientsDog } from "@/lib/actions/client.action";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import React from "react";

const DeleteDog: React.FC = () => {
  const { closeModal, modalData } = useModalStore();
  const clientId = modalData?.clientId as string;
  const dog = modalData?.dog as any;
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);
    if (!clientId) return;
    try {
      const res = await deleteClientsDog({
        clientId,
        dogId: dog._id,
      });
      const updatedClient = JSON.parse(res);
      if (updatedClient) {
        router.refresh();
        setIsLoading(false);
        toast.success(`Το κατοικίδιο ${dog.name} διαγράφηκε επιτυχώς!`);
        closeModal();
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(`Η διαγραφή του κατοικίδιου ${dog.name} απέτυχε!`);
      closeModal();
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };
  return (
    <section className="flex h-full w-full flex-col items-center justify-center space-y-8">
      <h2 className="text-2xl font-bold tracking-widest">
        Διαγραφή Κατοικιδίου
      </h2>

      <p className="text-xl">
        Είστε σίγουροι ότι θέλετε να διαγράψετε τον{" "}
        <span className="uppercase tracking-widest text-primary-500">
          {dog?.name}
        </span>
      </p>
      <p className="text-lg tracking-wide ">
        Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.
      </p>
      <div className="flex justify-end space-x-4">
        <Button
          color="secondary"
          variant="bordered"
          size="lg"
          onPress={closeModal}
          isDisabled={isLoading}
          className=" tracking-widest text-white "
        >
          Ακύρωση
        </Button>
        <Button
          color="danger"
          size="lg"
          variant="bordered"
          onPress={() => {
            handleDelete();
          }}
          className=" tracking-widest text-white"
          isLoading={isLoading}
        >
          Διαγραφή
        </Button>
      </div>
    </section>
  );
};

export default DeleteDog;
