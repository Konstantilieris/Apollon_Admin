import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Chip } from "@heroui/chip";
import { format } from "date-fns";
import { Divider } from "@heroui/divider";
import DogList from "./DogList";
import { Button, Card, CardBody } from "@heroui/react";
import { useModalStore } from "@/hooks/client-profile-store";
import { el } from "date-fns/locale";

const ClientInfo = ({ client }: any) => {
  const { openModal } = useModalStore();
  const aliveDogs = client.dog.filter((dog: any) => !dog.isDead);

  return (
    <div className="flex w-full flex-row rounded-xl bg-dark-100 px-2 py-1">
      <div className="flex  min-w-[30vw] flex-col">
        <div className="flex  w-full flex-col">
          <div className="flex flex-row items-center py-1">
            <h2 className="text-xl font-semibold tracking-widest">
              Στοιχεία Πελάτη
            </h2>
            <Button
              className="ml-auto tracking-widest"
              variant="bordered"
              color="secondary"
              onPress={() => openModal("clientInfo", { client })}
            >
              ΕΠΕΞΕΡΓΑΣΙΑ
            </Button>
          </div>
          <Divider className="my-1.5" />
        </div>
        <div className="w-full space-y-6">
          {/* Προσωπικά Στοιχεία */}
          <div className="px-1">
            <h3 className="mb-2 text-lg font-semibold tracking-wide">
              Προσωπικά Στοιχεία
            </h3>
            <Table
              hideHeader
              className="w-full "
              classNames={{
                table: "w-1/2 ",
                base: "w-full ",
                td: "w-1/2 text-lg",
              }}
            >
              <TableHeader>
                <TableColumn>Πεδίο</TableColumn>
                <TableColumn>Πληροφορίες</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Όνομα</TableCell>
                  <TableCell>{client?.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Email</TableCell>
                  <TableCell>{client?.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Επάγγελμα</TableCell>
                  <TableCell>{client?.profession}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Κατάσταση</TableCell>
                  <TableCell>
                    <Chip
                      variant={client?.status === "active" ? "dot" : "flat"}
                      color={
                        client.status === "active" ? "secondary" : "warning"
                      }
                      size="lg"
                    >
                      {client?.status === "active" ? "Ενεργός" : "Ανενεργός"}
                    </Chip>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Πελάτης Από</TableCell>
                  <TableCell>
                    {format(new Date(client?.createdAt), "PPP", { locale: el })}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Τελευταία Δραστηριότητα
                  </TableCell>
                  <TableCell>
                    {client?.lastActivity &&
                      format(new Date(client?.lastActivity), "PPP", {
                        locale: el,
                      })}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Στοιχεία Επικοινωνίας */}
          <div className="px-1">
            <h3 className="mb-2 text-lg font-semibold tracking-wide">
              Στοιχεία Επικοινωνίας
            </h3>
            <Table
              hideHeader
              className="w-full"
              classNames={{
                table: "w-1/2",

                td: "w-1/2 text-lg",
              }}
            >
              <TableHeader>
                <TableColumn>Πεδίο</TableColumn>
                <TableColumn>Πληροφορίες</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Τηλέφωνο</TableCell>
                  <TableCell>
                    {client?.phone?.telephone || "Δεν παρέχεται"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Κινητό</TableCell>
                  <TableCell>
                    {client?.phone?.mobile || "Δεν παρέχεται"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Τηλ. Εργασίας</TableCell>
                  <TableCell>
                    {client?.phone?.work_phone || "Δεν παρέχεται"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Επείγουσα Επικοινωνία
                  </TableCell>
                  <TableCell>
                    {client?.phone?.emergencyContact || "Δεν παρέχεται"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Διεύθυνση */}
          <div className="px-1">
            <h3 className="mb-2 text-lg font-semibold tracking-wide">
              Διεύθυνση
            </h3>
            <Table
              hideHeader
              className="w-full"
              classNames={{
                table: "w-1/2",

                td: "w-1/2 text-lg",
              }}
            >
              <TableHeader>
                <TableColumn>Πεδίο</TableColumn>
                <TableColumn>Πληροφορίες</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Τύπος Κατοικίας</TableCell>
                  <TableCell>{client?.location?.residence ?? ""}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Διεύθυνση</TableCell>
                  <TableCell>{client?.location?.address ?? ""}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Πόλη</TableCell>
                  <TableCell>{client?.location.city ?? ""}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Ταχ. Κώδικας</TableCell>
                  <TableCell>{client?.location?.postalCode ?? ""}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Πιστότητα & Προτιμήσεις */}
          <div className="px-1">
            <h3 className="mb-2 text-lg font-semibold tracking-widest">
              Πιστότητα & Προτιμήσεις
            </h3>
            <Table
              hideHeader
              className="w-full"
              classNames={{
                table: "w-1/2 ",
                td: "w-1/2 text-lg",
              }}
            >
              <TableHeader>
                <TableColumn>Πεδίο</TableColumn>
                <TableColumn>Πληροφορίες</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    Πόντοι Πιστότητας
                  </TableCell>
                  <TableCell>{client?.points ?? 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Επίπεδο Πιστότητας
                  </TableCell>
                  <TableCell>
                    <Chip
                      variant="bordered"
                      className="uppercase tracking-widest"
                    >
                      {client?.loyaltyLevel}
                    </Chip>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Προτιμώμενο Δωμάτιο
                  </TableCell>
                  <TableCell>{client?.roomPreference ?? ""}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Προτιμήσεις Υπηρεσιών
                  </TableCell>
                  <TableCell className="flex flex-row  gap-1">
                    {client.servicePreferences.map((pref: any, i: any) => (
                      <Chip
                        key={i}
                        color="danger"
                        className="uppercase tracking-widest"
                        variant="dot"
                      >
                        {pref}
                      </Chip>
                    ))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Εκπαίδευση Σε Εξέλιξη
                  </TableCell>
                  <TableCell>{client?.isTraining ? "Ναι" : "Όχι"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Οικονομική Σύνοψη */}
          <div className="px-1">
            <h3 className="mb-2 text-lg font-semibold tracking-widest">
              Οικονομική Σύνοψη
            </h3>
            <Table
              hideHeader
              className="w-full"
              classNames={{
                table: "w-1/2",
                td: "w-1/2 text-lg",
              }}
            >
              <TableHeader>
                <TableColumn>Πεδίο</TableColumn>
                <TableColumn>Πληροφορίες</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Σύνολο Δαπανών</TableCell>
                  <TableCell>{client?.totalSpent ?? 0}€</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Υπόλοιπο Οφειλής
                  </TableCell>
                  <TableCell>{client?.owesTotal ?? 0}€</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Διαθέσιμη Πίστωση
                  </TableCell>
                  <TableCell>{client?.credit ?? 0}€</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold">Κτηνίατρος</h3>
            <Table
              hideHeader
              className="w-full"
              classNames={{
                table: "w-1/2",
                td: "w-1/2 text-lg",
              }}
            >
              <TableHeader>
                <TableColumn>Πεδίο</TableColumn>
                <TableColumn>Πληροφορίες</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Όνομα</TableCell>
                  <TableCell>{client?.vet.name ?? ""}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Τηλέφωνο</TableCell>
                  <TableCell>{client?.vet.phone ?? ""}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Τηλ. Εργασίας</TableCell>
                  <TableCell>{client?.vet.work_phone ?? ""}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Διεύθυνση</TableCell>
                  <TableCell>
                    {client?.vet?.location?.address ?? ""},{" "}
                    {client?.vet?.location?.city ?? ""},{" "}
                    {client?.vet?.location?.postalCode ?? ""}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <Card className="w-full " disableRipple>
            <CardBody className="gap-4">
              <div>
                <h3 className="mb-4 text-xl font-semibold">Αναφορές</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="mb-2 text-lg font-medium">Προτάθηκε Από</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="w-32 text-default-500">Πελάτης:</span>
                        <span>
                          {client?.references?.isReferenced?.client?.name}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-32 text-default-500">
                          Google Review:
                        </span>
                        <span>
                          {client?.references?.isReferenced?.google
                            ? "Ναι"
                            : "Όχι"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-32 text-default-500">Άλλο:</span>
                        <span>{client?.references?.isReferenced?.other}</span>
                      </div>
                    </div>
                  </div>

                  <Divider className="my-4" />

                  <div>
                    <h4 className="mb-2 text-lg font-medium">Έχει Προτείνει</h4>
                    <ul className="list-disc space-y-1 pl-8">
                      {client?.references?.hasReferenced.map(
                        (ref: any, index: any) => (
                          <li key={index} className="text-default-600">
                            {ref?.name}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
          <Card className="w-full max-w-md" disableRipple>
            <CardBody className="gap-2">
              <h3 className="text-xl font-semibold">Σημειώσεις</h3>
              <div className="mt-2 rounded-lg bg-default-100 p-4 text-default-700">
                {client?.notes}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <DogList clientId={client._id} dogs={aliveDogs} />
    </div>
  );
};

export default ClientInfo;
