import React from "react";
import { Icon } from "@iconify/react";
import {
  Chip,
  Card,
  CardBody,
  Button,
  Divider,
  Link,
  Skeleton,
} from "@heroui/react";
import { getClientById } from "@/lib/actions/client.action";

interface ClientConfirmationProps {
  id: string | null;
}

export default function ClientConfirmation({ id }: ClientConfirmationProps) {
  const [client, setClient] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchClient = async () => {
      try {
        if (!id) return;
        const response = await getClientById(id);
        const data = JSON.parse(response);
        setClient(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchClient();
  }, [id]);

  return (
    <Skeleton isLoaded={!loading}>
      <Card className="w-full bg-default-50">
        <CardBody className="flex flex-col items-center gap-5 py-8">
          <div className="flex w-full flex-col items-center px-8">
            <Icon
              className="mb-3 text-success-500"
              icon="lucide:check-circle"
              width={56}
            />
            <p className="mb-2 text-base font-medium">
              Η εγγραφή του πελάτη ολοκληρώθηκε
            </p>
            <p className="text-center text-small text-default-500">
              Ο πελάτης καταχωρήθηκε επιτυχώς στο σύστημα.
            </p>
          </div>

          <Divider className="w-full bg-default-200" />

          <div className="flex w-full flex-col gap-4 px-8">
            <div className="flex w-full flex-col gap-1">
              <p className="text-small font-medium">Πληροφορίες Πελάτη</p>
              <p className="text-tiny text-default-500">
                {client?.name}
                {client?.email && ` (${client.email})`}
              </p>
            </div>

            {client?.phone && (
              <div className="flex w-full flex-col gap-1">
                <p className="text-small font-medium">Στοιχεία Επικοινωνίας</p>
                {client.phone.mobile && (
                  <p className="text-tiny text-default-500">
                    Κινητό: {client.phone.mobile}
                  </p>
                )}
                {client.phone.telephone && (
                  <p className="text-tiny text-default-500">
                    Σταθερό: {client.phone.telephone}
                  </p>
                )}
              </div>
            )}

            {client?.location && (
              <div className="flex w-full flex-col gap-1">
                <p className="text-small font-medium">Τοποθεσία</p>
                <p className="text-tiny text-default-500">
                  {client.location.address && `${client.location.address}, `}
                  {client.location.city && `${client.location.city}, `}
                  {client.location.postalCode}
                </p>
              </div>
            )}

            {client?.dog && client.dog.length > 0 && (
              <div className="flex w-full flex-col gap-1">
                <p className="text-small font-medium">Εγγεγραμμένοι Σκύλοι</p>
                {client.dog.map((dog: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <p className="text-tiny text-default-500">{dog.name}</p>
                    <Chip
                      classNames={{
                        base: "px-0.5 h-4",
                        content: "text-[10px] leading-3",
                      }}
                      color="primary"
                      size="sm"
                      variant="flat"
                    >
                      {dog.breed || "Δεν έχει καθοριστεί"}
                    </Chip>
                  </div>
                ))}
              </div>
            )}

            {client?.loyaltyLevel && (
              <div className="flex w-full flex-col gap-1">
                <p className="text-small font-medium">Πρόγραμμα Πιστότητας</p>
                <div className="flex items-center gap-2">
                  <p className="text-tiny text-default-500">
                    Αρχικό Επίπεδο:{" "}
                    {client.loyaltyLevel.charAt(0).toUpperCase() +
                      client.loyaltyLevel.slice(1)}
                  </p>
                  <Chip
                    classNames={{
                      base: "px-0.5 h-4",
                      content: "text-[10px] leading-3",
                    }}
                    color="primary"
                    size="sm"
                    variant="flat"
                  >
                    {client.points || 0} πόντοι
                  </Chip>
                </div>
              </div>
            )}
          </div>

          <Divider className="w-full bg-default-100" />

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <Button
                as={Link}
                href={`/clients/${id}`}
                variant="flat"
                color="primary"
                size="sm"
              >
                Προφίλ Πελάτη
              </Button>
              <Button
                as={Link}
                href="/clients"
                variant="light"
                color="default"
                size="sm"
              >
                Προβολή Όλων των Πελατών
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </Skeleton>
  );
}
