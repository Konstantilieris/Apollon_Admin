"use client";
import React, { SVGProps } from "react";

import {
  Table,
  Selection,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  SortDescriptor,
  Pagination,
  Button,
  Input,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import { ILocation } from "@/database/models/client.model";
import { useRouter } from "next/navigation";

export interface Client {
  name: string;
  email: string;
  profession: string;
  owesTotal: number;
  phone: {
    telephone: string;
    mobile: string;
  };
  _id: string;
  location: ILocation;
  dog: {
    name: string;
  }[];
}

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};
export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}
export const VerticalDotsIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size || height}
      role="presentation"
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <path
        d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        fill="currentColor"
      />
    </svg>
  );
};

export const SearchIcon = (props: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export const ChevronDownIcon = ({
  strokeWidth = 1.5,
  ...otherProps
}: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...otherProps}
    >
      <path
        d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};
const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "dog",
  "profession",
  "phone",
  "location",
  "actions",
];
export const columns = [
  { name: "ΟΝΟΜΑ", uid: "name", sortable: true },
  { name: "ΣΚΥΛΙΑ", uid: "dog", sortable: true },
  { name: "ΕΠΑΓΓΕΛΜΑ", uid: "profession", sortable: true },
  { name: "ΤΗΛΕΦΩΝΑ", uid: "phone" },
  { name: "ΠΕΡΙΟΧΗ", uid: "location" },
  { name: "ΕΝΕΡΓΕΙΕΣ", uid: "actions" },
  {},
];
const ClientTable = ({
  clients,
  professions,
}: {
  clients: Client[];
  professions: string[];
}) => {
  const [page, setPage] = React.useState(1);
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const router = useRouter();
  const [debtTotal, setDebtTotal] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const [filterValue, setFilterValue] = React.useState("");
  const [filterProfession, setFilterProfession] = React.useState<any>("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );

  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid!)
    );
  }, [visibleColumns]);
  const pages = Math.ceil(clients.length / rowsPerPage);
  const filteredItems = React.useMemo(() => {
    // If no filter is applied, return all clients.
    if (!filterValue && !filterProfession) return clients;
    const lowerFilterValue = filterValue.toLowerCase();
    const lowerFilterProfession = filterProfession.toLowerCase();

    return clients.filter((user) => {
      // Matches for the general text search
      const matchesText =
        filterValue &&
        (user.name.toLowerCase().includes(lowerFilterValue) ||
          user.profession.toLowerCase().includes(lowerFilterValue) ||
          user.phone.telephone.includes(filterValue) ||
          user.phone.mobile.includes(filterValue) ||
          user.dog.some((dog) =>
            dog.name.toLowerCase().includes(lowerFilterValue)
          ));

      // Matches for the autocomplete profession filter
      const matchesProfession =
        filterProfession &&
        user.profession.toLowerCase().includes(lowerFilterProfession);

      // Return true if either condition matches
      return matchesText || matchesProfession;
    });
  }, [clients, filterValue, filterProfession]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);
  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );
  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setFilterProfession("");
    setPage(1);
  }, []);
  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Client, b: Client) => {
      const first = a[sortDescriptor.column as keyof Client] as number;
      const second = b[sortDescriptor.column as keyof Client] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);
  React.useEffect(() => {
    if (selectedKeys === "all") {
      setDebtTotal(
        filteredItems.reduce((acc, client) => acc + client.owesTotal, 0)
      );
    } else {
      setDebtTotal(
        clients
          .filter((client) => selectedKeys.has(client._id))
          .reduce((acc, client) => acc + client.owesTotal, 0)
      );
    }
  }, [selectedKeys, clients, filteredItems]);
  const renderCell = React.useCallback((user: Client, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof Client];
    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{
              size: "sm",
              radius: "full",
              className:
                "transition-all duration-200 hover:scale-110 hover:ring-2 hover:ring-blue-500 cursor-pointer",
              onClick: (event) => {
                event.stopPropagation(); // Prevents row selection
                router.push(`/clients/${user._id}`);
              },
            }}
            className=" select-none text-lg"
            description={
              <span className="pointer-events-none text-sm text-gray-400">
                {user.email}
              </span>
            }
            name={
              <span className="pointer-events-none text-base">{user.name}</span>
            }
          >
            {user.email}
          </User>
        );
      case "dog":
        return (
          <div className="flex gap-2">
            {user.dog.map((dog, index) => (
              <Chip key={index} size="sm" className="text-sm">
                {dog.name}
              </Chip>
            ))}
          </div>
        );
      case "location": {
        const location = `${user.location.address ?? ""} ${
          user.location.city ?? ""
        } ${user.location.postalCode ?? ""}`;
        return <div className="flex gap-2">{location}</div>;
      }
      case "profession":
        return <div className="text-sm">{user.profession}</div>;
      case "phone":
        return (
          <div className="flex gap-2">
            <span className="text-sm">{user.phone.telephone}</span>
            <span className="text-sm">{user.phone.mobile}</span>
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <span className="cursor-pointer text-lg text-default-400 active:opacity-50">
                -
              </span>
            </Tooltip>
          </div>
        );
      default:
        return <>{cellValue}</>;
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <div className="flex items-center gap-8">
            <Input
              isClearable
              className="w-full max-w-[15vw] lg:min-w-[400px] "
              classNames={{
                inputWrapper:
                  "group-data-[focus=true]:border-yellow-500 group-data-[focus=true]:border ",
              }}
              placeholder="Ψάξε Πελάτη"
              startContent={<SearchIcon className="mr-2" />}
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
            />
            <Autocomplete
              className="min-w-[350px]"
              placeholder="Ψάξε Επάγγελμα"
              selectedKey={filterProfession}
              onSelectionChange={(profession) =>
                setFilterProfession(profession)
              }
            >
              {professions.map((profession: string, index: number) => (
                <AutocompleteItem key={profession} className="font-sans">
                  {profession}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            <Button
              color="warning"
              className="min-w-[100px] p-2 font-sans font-semibold tracking-widest"
              onPress={() => {
                setFilterProfession("");
                setFilterValue("");
                console.log("Filter cleared");
              }}
              disabled={!filterValue && !filterProfession}
            >
              Καθαρισμός
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Στήλες
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid!} className="capitalize">
                    {capitalize(column.name!)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Σύνολο {clients.length} πελατών
          </span>
          <label className="flex items-center text-small text-default-400">
            Γραμμές ανά σελίδα
            <select
              className="bg-neutral-900 font-sans text-base text-default-400 outline-none"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="20">25</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    onSearchChange,

    filterProfession,
    onRowsPerPageChange,
    clients.length,
    visibleColumns,
  ]);
  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex items-center justify-between p-2">
        <div>
          <span className="w-[30%] text-small text-default-400">
            {selectedKeys === "all"
              ? "Όλες οι σειρές είναι επιλεγμένες"
              : `${selectedKeys.size} απο ${filteredItems.length} επιλέχθηκαν`}
          </span>
          <Chip
            className="ml-4 min-h-[26px] rounded-lg p-2 text-sm text-light-900"
            color="secondary"
          >
            {`ΟΦΕΙΛΕΣ: ${debtTotal}€`}
          </Chip>
        </div>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden w-[30%] justify-end gap-2 sm:flex">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Προηγούμενο
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Επόμενο
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, debtTotal]);

  return (
    <Table
      isHeaderSticky
      aria-label="Example table with custom cells, pagination and sorting"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[80vhpx]",
      }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      color="secondary"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No users found"} items={sortedItems}>
        {(item) => {
          return (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          );
        }}
      </TableBody>
    </Table>
  );
};

export default ClientTable;
