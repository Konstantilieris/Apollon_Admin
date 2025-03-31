import React from "react";
import { Button, Textarea, DateInput, Skeleton } from "@heroui/react";
import { Input } from "@heroui/input";
import { Icon } from "@iconify/react";
import { parseDate } from "@internationalized/date";
import { ServiceSwitcher } from "../shared/constantManagement/ServiceSwitcher";
import { useRouter } from "next/navigation";

interface Service {
  type: string;
  value: string;
}

interface Client {
  _id: string;
  serviceFees: Service[];
  servicePreferences: string[];
}

interface ChargeFormProps {
  client: Client;
  services: any;
  initialData?: {
    serviceType: string;
    amount: string;
    date: Date;
    notes: string;
  };
  onSubmit: (data: {
    clientId: string;
    serviceType: string;
    amount: string;
    date: Date;
    notes: string;
  }) => Promise<void>;
}
const getLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const ChargeForm = ({
  client,
  services,
  onSubmit,
  initialData,
}: ChargeFormProps) => {
  const [selectedService, setSelectedService] = React.useState(
    initialData?.serviceType ?? ""
  );
  const [selectedAmount, setSelectedAmount] = React.useState(
    initialData?.amount ?? ""
  );
  const [selectedDate, setSelectedDate] = React.useState(
    initialData?.date
      ? parseDate(getLocalDateString(new Date(initialData.date)))
      : parseDate(getLocalDateString(new Date()))
  );
  const [selectedNote, setSelectedNote] = React.useState(
    initialData?.notes ?? ""
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await onSubmit({
        clientId: client._id,
        serviceType: selectedService,
        amount: selectedAmount,
        date: selectedDate.toDate("UTC"),
        notes: selectedNote,
      });

      // Reset form
      setSelectedService("");
      setSelectedAmount("");
      setSelectedDate(parseDate(new Date().toISOString().split("T")[0]));
      setSelectedNote("");
    } catch (error) {
      console.error("Error submitting charge:", error);
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <div className="flex w-full min-w-[60vw] flex-col items-center gap-6 py-10">
      <h1 className="text-lg tracking-widest"> ΧΡΕΩΣΗ ΥΠΗΡΕΣΙΑΣ</h1>
      <div className="flex flex-col gap-2 max-md:w-full md:min-w-[30vw]">
        <label className="text-base  font-medium tracking-wide text-default-700">
          Υπηρεσία
        </label>
        <Skeleton isLoaded={!!client}>
          <ServiceSwitcher
            items={services.value ?? []}
            placeholder="Επίλεξε Υπηρεσία"
            heading="Διαχείριση Υπηρεσιών"
            selectedItem={selectedService}
            client={client}
            setAmount={setSelectedAmount}
            setSelectedItem={setSelectedService}
          />
        </Skeleton>
      </div>

      <div className="flex flex-col gap-2 max-md:w-full md:min-w-[30vw]">
        <label className="text-base font-medium tracking-wide text-default-700">
          Ημερομηνία
        </label>
        <DateInput
          value={selectedDate}
          onChange={(value) => value && setSelectedDate(value)}
        />
      </div>

      <div className="flex flex-col gap-2 max-md:w-full md:min-w-[30vw]">
        <label className="text-base font-medium tracking-wide text-default-700">
          Σημειώσεις
        </label>
        <Textarea
          value={selectedNote}
          onValueChange={setSelectedNote}
          placeholder="Πρόσθεσε παρατηρήσεις και σημειώσεις"
          minRows={3}
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-2 max-md:w-full md:min-w-[30vw]">
        <label className="text-sm font-medium text-default-700">Ποσό</label>
        <Input
          type="number"
          value={selectedAmount}
          onValueChange={setSelectedAmount}
          placeholder="Αρχικό ποσό"
          startContent={
            <Icon
              icon="lucide:currency-euro"
              className="h-4 w-4 bg-white text-light-900 "
            />
          }
        />
      </div>

      <Button
        color="primary"
        isDisabled={!selectedService || !selectedAmount}
        isLoading={isLoading}
        onPress={handleSubmit}
        fullWidth
      >
        <Icon icon="lucide:plus" className="mr-2" />
        ΧΡΕΩΣΗ
      </Button>
    </div>
  );
};
