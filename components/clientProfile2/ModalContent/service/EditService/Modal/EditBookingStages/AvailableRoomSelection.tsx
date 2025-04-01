import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Select,
  SelectItem,
  Pagination,
  Button,
} from "@heroui/react";
import { DogProp } from "@/types";

interface Room {
  _id: string;
  name: string;
  capacity: number;
  dogsAssigned?: DogProp[];
}

interface RoomSelectionTableProps {
  availableRooms: Room[];
  client: any;
  onDogAssignment: (roomId: string, dogs: DogProp[], roomName: string) => void;
  dogsInRooms: {
    dogId: string;
    dogName: string;
    roomId: string | null;
    roomName: string | null;
  }[];
  handleSubmit: () => void;
  handleBack: () => void;
}

export const RoomSelectionTable: React.FC<RoomSelectionTableProps> = ({
  availableRooms = [],
  client,
  onDogAssignment,
  dogsInRooms,
  handleSubmit,
  handleBack,
}) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const paginatedRooms = useMemo(
    () => availableRooms.slice((page - 1) * rowsPerPage, page * rowsPerPage),
    [availableRooms, page]
  );

  const handleSelectionChange = (
    roomId: string,
    dogIds: Set<string>,
    roomName: string
  ) => {
    const selectedDogs = client.dog.filter((dog: any) => dogIds.has(dog._id));
    onDogAssignment(roomId, selectedDogs, roomName);
  };

  const getSelectedDogIds = (roomId: string): Set<string> => {
    // Ensure dogsInRooms is an array
    const safeDogsInRooms = Array.isArray(dogsInRooms) ? dogsInRooms : [];
    return new Set(
      safeDogsInRooms
        .filter((dog) => dog.roomId === roomId)
        .map((dog) => dog.dogId)
    );
  };

  if (availableRooms.length === 0 || !client) return null;

  return (
    <div className="flex max-h-[calc(100vh_-_400px)] flex-col items-center gap-4 overflow-y-auto p-4">
      <div className="flex w-full items-center justify-between rounded-lg bg-neutral-950 p-4">
        <span className="mx-auto text-xl tracking-widest text-gray-300">
          ΕΠΙΛΟΓΗ ΔΩΜΑΤΙΩΝ
        </span>
      </div>

      <Table
        aria-label="Πίνακας επιλογής δωματίων"
        shadow="md"
        className="w-[90vw] max-w-[1400px]"
        classNames={{
          td: "text-start text-base",
          thead: "text-lg",
          th: "text-base tracking-widest",
        }}
        bottomContentPlacement="outside"
        bottomContent={
          <Pagination
            total={Math.ceil(availableRooms.length / rowsPerPage)}
            page={page}
            onChange={setPage}
            color="danger"
            className="mx-auto"
            showControls
            size="sm"
          />
        }
      >
        <TableHeader>
          <TableColumn>ΟΝΟΜΑ ΔΩΜΑΤΙΟΥ</TableColumn>
          <TableColumn>ΧΩΡΗΤΙΚΟΤΗΤΑ</TableColumn>
          <TableColumn>ΣΚΥΛΟΙ</TableColumn>
          <TableColumn>ΕΠΙΛΟΓΗ ΣΚΥΛΩΝ</TableColumn>
        </TableHeader>
        <TableBody>
          {paginatedRooms.map((room: Room) => {
            // Use a safe version of dogsInRooms for filtering
            const safeDogsInRooms = Array.isArray(dogsInRooms)
              ? dogsInRooms
              : [];
            const assignedDogs = safeDogsInRooms.filter(
              (d) => d.roomId === room._id
            );
            const isOverCapacity = assignedDogs.length > 5;

            return (
              <TableRow key={room._id}>
                <TableCell className="pl-12 tracking-widest">
                  {room.name}
                </TableCell>
                <TableCell>
                  <Chip color={isOverCapacity ? "danger" : "success"} size="sm">
                    {assignedDogs.length}/{room.capacity || 5}
                  </Chip>
                </TableCell>
                <TableCell>
                  {assignedDogs.length > 0 ? (
                    assignedDogs.map((dog) => (
                      <Chip
                        key={dog.dogId}
                        color="warning"
                        className="text-base"
                        variant="dot"
                        size="sm"
                      >
                        {dog.dogName}
                      </Chip>
                    ))
                  ) : (
                    <span className="text-base tracking-wide text-gray-500">
                      Κανένας σκύλος
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Select
                    selectionMode="multiple"
                    placeholder="Επιλέξτε σκύλους"
                    selectedKeys={getSelectedDogIds(room._id)}
                    onSelectionChange={(keys) =>
                      handleSelectionChange(
                        room._id,
                        keys as Set<string>,
                        room.name
                      )
                    }
                    isMultiline
                  >
                    {client.dog.map((dog: any) => (
                      <SelectItem key={dog._id} className="font-sans text-base">
                        {dog.name}
                      </SelectItem>
                    ))}
                  </Select>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="mt-4 flex gap-4">
        <Button onPress={handleBack} variant="ghost" color="danger">
          ΠΙΣΩ
        </Button>
        <Button
          onPress={handleSubmit}
          isDisabled={
            Array.isArray(dogsInRooms) &&
            dogsInRooms.every((dog) => !dog.roomId)
          }
          className="rounded-lg border border-black px-6 py-2 font-bold transition hover:-translate-y-1 dark:border-white dark:text-yellow-500"
        >
          ΣΥΝΕΧΕΙΑ
        </Button>
      </div>
    </div>
  );
};
