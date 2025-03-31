import React, { useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  SortDescriptor,
  Skeleton,
  Chip,
} from "@heroui/react";

import { useDateFormatter } from "@react-aria/i18n";

import { useBookingStore } from "@/hooks/booking-store";
import { getAllAvailableRooms } from "@/lib/actions/booking.action";
import { Icon } from "@iconify/react";
import { getDurationDays } from "@/lib/utils";

const DetailsAndAvailability = () => {
  const formatter = useDateFormatter({
    dateStyle: "long",
    timeStyle: "short",
  });
  const { dateArrival, dateDeparture, extraDay, taxiArrival, taxiDeparture } =
    useBookingStore();
  const rowsPerPage = 5;

  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [rooms, setRooms] = React.useState<any[]>([]);
  const [freeCapacityPercentage, setFreeCapacityPercentage] = React.useState<
    number | null
  >(null);
  useEffect(() => {
    // Ensure both dates are set
    if (!dateArrival || !dateDeparture) return;

    const fetchAvailableRooms = async () => {
      setLoading(true);

      try {
        const response = await getAllAvailableRooms({
          dateArrival,
          dateDeparture,
        });
        setRooms(response.emptyRooms);
        setFreeCapacityPercentage(parseFloat(response.freeCapacityPercentage));
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableRooms();
  }, [dateArrival, dateDeparture]);
  const sortedRooms = React.useMemo(() => {
    const sorted = [...rooms].sort((a, b) => {
      const first = sortDescriptor.direction === "ascending" ? a : b;
      const second = sortDescriptor.direction === "ascending" ? b : a;
      return first.name.localeCompare(second.name);
    });

    return sorted;
  }, [rooms, sortDescriptor]);
  const formatDateTime = (date: Date) => {
    return formatter.format(date);
  };
  const paginatedRooms = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedRooms.slice(start, end);
  }, [sortedRooms, page]);
  const getCapacityColor = (capacity: number) => {
    if (capacity >= 70) return "success";
    if (capacity >= 50) return "warning";
    if (capacity >= 40) return "danger";
    return "default";
  };
  const pages = Math.ceil(rooms.length / rowsPerPage);
  const topContent = React.useMemo(() => {
    if (!freeCapacityPercentage) return null;

    const color = getCapacityColor(freeCapacityPercentage);
    return (
      <div className="flex items-center justify-between px-2 py-4">
        <div className="flex items-center gap-3">
          <span className="tracking-widest text-default-600">
            Διαθεσιμότητα:
          </span>
          <Chip color={color} size="lg">
            {`${Math.round(freeCapacityPercentage)}%`}
          </Chip>
        </div>
      </div>
    );
  }, [freeCapacityPercentage]);

  return (
    <Skeleton isLoaded={!loading}>
      <div className="flex min-w-[15vw] flex-col space-y-6 rounded-lg bg-neutral-950 p-6 ">
        <div className="space-y-4">
          {dateArrival && dateDeparture && (
            <div className="space-y-2">
              <p className="text-default-600">
                <strong>Άφιξη:</strong> {formatDateTime(dateArrival)}
              </p>
              <p className="text-default-600">
                <strong>Αναχώρηση:</strong> {formatDateTime(dateDeparture)}
              </p>
              <p className="flex items-center gap-2 text-default-600">
                <strong>PetTaxi Άφιξη:</strong>{" "}
                {taxiArrival ? (
                  <Icon icon="lucide:check" className="text-success-500" />
                ) : (
                  <Icon icon="lucide:x" className="text-danger-500" />
                )}
              </p>
              <p className="flex items-center gap-2 text-default-600">
                <strong>PetTaxi Αναχώρηση:</strong>{" "}
                {taxiDeparture ? (
                  <Icon icon="lucide:check" className="text-success-500" />
                ) : (
                  <Icon icon="lucide:x" className="text-danger-500" />
                )}
              </p>
              <p className="flex items-center gap-2 text-default-600">
                <strong>Επιπλέον Ημέρα:</strong>{" "}
                {extraDay ? (
                  <Icon icon="lucide:check" className="text-success-500" />
                ) : (
                  <Icon icon="lucide:x" className="text-danger-500" />
                )}
              </p>
              <p className="text-default-600">
                <strong>
                  Διάρκεια: {getDurationDays(dateArrival, dateDeparture)}
                </strong>{" "}
                νύχτες
              </p>
            </div>
          )}
        </div>

        <Table
          aria-label="Available Rooms"
          selectionMode="single"
          isStriped
          removeWrapper
          topContent={topContent}
          topContentPlacement="outside"
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
        >
          <TableHeader>
            <TableColumn allowsSorting key="name">
              Δωμάτιο
            </TableColumn>

            <TableColumn>ΔΙΑΘΕΣΙΜΟΤΗΤΑ</TableColumn>
          </TableHeader>
          <TableBody
            isLoading={loading}
            loadingContent={<div className="p-4">Loading rooms...</div>}
            emptyContent={
              !dateArrival || !dateDeparture
                ? "Διαλέξτε ημερομηνίες"
                : "Δεν υπάρχουν διαθέσιμα δωμάτια"
            }
          >
            {paginatedRooms.map((room) => (
              <TableRow key={room._id}>
                <TableCell className="pl-4">{room.name}</TableCell>

                <TableCell className="pl-12">
                  <Chip color="success" size="lg">
                    <Icon icon="solar:room-outline" className="mr-2" />
                  </Chip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {rooms.length > 0 && (
          <div className="flex justify-center">
            <Pagination
              total={pages}
              page={page}
              onChange={setPage}
              showControls
              color="primary"
            />
          </div>
        )}
      </div>
    </Skeleton>
  );
};
export default DetailsAndAvailability;
