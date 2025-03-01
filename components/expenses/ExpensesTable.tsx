"use client";

import type { Selection, SortDescriptor } from "@heroui/react";
import {
  Expense,
  expenseColumns,
  INITIAL_VISIBLE_EXPENSE_COLUMNS,
} from "./data";
import type { Key } from "@react-types/shared";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  RadioGroup,
  Radio,
  Chip,
  Pagination,
  Divider,
  Tooltip,
  useButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  cn,
} from "@heroui/react";
import { SearchIcon } from "@heroui/shared-icons";
import React, { useMemo, useRef, useCallback, useState } from "react";
import { Icon } from "@iconify/react";

import { EditLinearIcon } from "./edit";

import { ArrowDownIcon } from "./arrow-down";
import { ArrowUpIcon } from "./arrow-up";
import { Status } from "./Status";

import { useMemoizedCallback } from "@/hooks/use-memoized-callback";

import { useExpensesStore } from "@/hooks/expenses-store";

export default function ExpensesTable({ expenses }: { expenses: Expense[] }) {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const paymentMethod = {
    creditcard: "Πιστωτική",
    cash: "Μετρητά",
    bank: "Τραπεζικό Έμβασμα",
  };

  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_EXPENSE_COLUMNS)
  );
  const [rowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "description",
    direction: "ascending",
  });

  const [paymentMethodFilter, setPaymentMethodFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const {
    setExpense,
    setToDeleteExpenses,
    setType,
    expense,
    resetStore,
    setIsOpen,
  } = useExpensesStore();
  const [dateFilter, setDateFilter] = React.useState("all");
  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return expenseColumns;

    return expenseColumns
      .map((item) => {
        if (item.uid === sortDescriptor.column) {
          return {
            ...item,
            sortDirection: sortDescriptor.direction,
          };
        }

        return item;
      })
      .filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns, sortDescriptor]);

  const itemFilter = useCallback(
    (expense: Expense) => {
      const allStatus = statusFilter === "all";
      const allDate = dateFilter === "all";
      console.log("filters", paymentMethodFilter, statusFilter, dateFilter);
      return (
        (allStatus ||
          expense.status.toLowerCase() === statusFilter.toLowerCase()) &&
        (allDate ||
          new Date(
            Date.now() -
              +(dateFilter.match(/(\d+)(?=Days)/)?.[0] ?? 0) *
                24 *
                60 *
                60 *
                1000
          ) <= new Date(expense.date))
      );
    },
    [dateFilter, statusFilter, paymentMethodFilter]
  );

  const filteredItems = useMemo(() => {
    let filteredExpenses = [...expenses];
    console.log("filtervalue", filterValue);
    if (filterValue) {
      filteredExpenses = filteredExpenses.filter((expense) =>
        expense.description.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    filteredExpenses = filteredExpenses.filter(itemFilter);

    return filteredExpenses;
  }, [expenses, filterValue, itemFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a: Expense, b: Expense) => {
      const col = sortDescriptor.column as keyof Expense;

      let first = a[col];
      let second = b[col];

      // For category: if populated, sort by its name.
      if (col === "category") {
        first =
          typeof a.category === "object" &&
          a.category !== null &&
          "name" in a.category
            ? (a.category as { name: string }).name
            : a.category;
        second =
          typeof b.category === "object" &&
          b.category !== null &&
          "name" in b.category
            ? (b.category as { name: string }).name
            : b.category;
      }
      // For vendor: compare by vendor name if available.
      else if (col === "vendor") {
        first = a.vendor ? a.vendor.name : "";
        second = b.vendor ? b.vendor.name : "";
      }
      // For date: convert to Date objects for comparison.
      else if (col === "date") {
        first = new Date(a.date);
        second = new Date(b.date);
      }

      // Standard comparison for numbers, dates, or strings.
      let cmp = 0;
      if (first < second) cmp = -1;
      else if (first > second) cmp = 1;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const filterSelectedKeys = useMemo(() => {
    if (selectedKeys === "all") return selectedKeys;
    let resultKeys = new Set<Key>();

    if (filterValue) {
      filteredItems.forEach((item) => {
        const stringId = String(item._id);

        if ((selectedKeys as Set<string>).has(stringId)) {
          resultKeys.add(stringId);
        }
      });
    } else {
      resultKeys = selectedKeys;
    }

    return resultKeys;
  }, [selectedKeys, filteredItems, filterValue]);

  const editRef = useRef<HTMLButtonElement | null>(null);

  const { getButtonProps: getEditProps } = useButton({ ref: editRef });

  const getDescriptionProps = useMemoizedCallback(() => ({
    onClick: handleMemberClick,
  }));
  const renderCell = (expense: Expense, columnKey: React.Key) => {
    const expenseKey = columnKey as
      | "date"
      | "description"
      | "category"
      | "amount"
      | "taxAmount"
      | "totalAmount"
      | "paymentMethod"
      | "vendor"
      | "status"
      | "actions";

    switch (expenseKey) {
      case "date": {
        const date = expense.date;
        return (
          <div className="flex items-center gap-1">
            <Icon
              className="h-[16px] w-[16px] text-default-300"
              icon="solar:calendar-minimalistic-linear"
            />
            <p className="text-nowrap text-small capitalize text-default-foreground">
              {new Intl.DateTimeFormat("el-GR", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }).format(new Date(date))}
            </p>
          </div>
        );
      }
      case "description": {
        return (
          <div className="text-small text-default-foreground">
            {expense.description}
          </div>
        );
      }
      case "category": {
        // Assuming expense.category might be populated (with a "name") or just an ObjectId
        const categoryDisplay =
          typeof expense.category === "object" &&
          expense.category !== null &&
          "name" in expense.category
            ? (expense.category as { name: string }).name
            : (expense.category as string).toString();
        return (
          <div className="text-small text-default-foreground">
            {categoryDisplay}
          </div>
        );
      }
      case "amount": {
        return (
          <div className="text-small text-default-foreground">
            {expense.amount}€
          </div>
        );
      }
      case "taxAmount": {
        return (
          <div className="text-small text-default-foreground">
            {expense.taxAmount ?? 0} %
          </div>
        );
      }
      case "totalAmount": {
        return (
          <div className="text-small font-semibold text-default-foreground">
            {expense.totalAmount.toFixed(2)} €
          </div>
        );
      }
      case "paymentMethod": {
        return (
          <div className="text-small text-default-foreground">
            {expense.paymentMethod
              ? paymentMethod[
                  expense?.paymentMethod as keyof typeof paymentMethod
                ]
              : ""}
          </div>
        );
      }
      case "vendor": {
        const vendor = expense.vendor;
        return vendor ? (
          <div className="flex flex-col">
            <span className="text-small text-default-foreground">
              {vendor.name}
            </span>
            {vendor.contactInfo && (
              <span className="text-xs text-default-500">
                {vendor.contactInfo}
              </span>
            )}
            {vendor.serviceType && (
              <span className="text-xs text-default-500">
                {vendor.serviceType}
              </span>
            )}
          </div>
        ) : (
          <div className="text-small text-default-foreground">-</div>
        );
      }
      case "status": {
        return <Status status={expense.status} />;
      }
      case "actions": {
        return (
          <div className="flex items-center justify-end gap-2">
            <EditLinearIcon
              {...getEditProps()}
              className="cursor-pointer text-default-400"
              height={18}
              width={18}
              onClick={() => handleEditClick(expense)}
            />
          </div>
        );
      }
      default:
        return null;
    }
  };

  const onNextPage = useMemoizedCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  });

  const onPreviousPage = useMemoizedCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  });

  const onSearchChange = useMemoizedCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  });

  const onSelectionChange = useMemoizedCallback((keys: Selection) => {
    if (keys === "all") {
      if (filterValue) {
        const resultKeys = new Set(
          filteredItems.map((item) => String(item._id))
        );

        setSelectedKeys(resultKeys);

        setToDeleteExpenses(filteredItems);
      } else {
        setSelectedKeys(keys);
        setToDeleteExpenses(expenses.filter(itemFilter).map((item) => item));
      }
    } else if (keys.size === 0) {
      setSelectedKeys(new Set());
      setToDeleteExpenses([]);
    } else {
      const resultKeys = new Set<Key>();

      keys.forEach((v) => {
        resultKeys.add(v);
      });
      const selectedValue =
        selectedKeys === "all"
          ? new Set(filteredItems.map((item) => String(item._id)))
          : selectedKeys;

      selectedValue.forEach((v) => {
        if (items.some((item) => String(item._id) === v)) {
          return;
        }
        resultKeys.add(v);
      });
      setSelectedKeys(new Set(resultKeys));
      setToDeleteExpenses(
        expenses.filter((item) => resultKeys.has(String(item._id)))
      );
    }
  });

  const topContent = useMemo(() => {
    return (
      <div className="flex items-center gap-4 overflow-auto px-[6px] py-[4px]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4">
            <Input
              className="min-w-[200px]"
              endContent={
                <SearchIcon className="text-default-400" width={16} />
              }
              placeholder="Search"
              size="sm"
              value={filterValue}
              onValueChange={onSearchChange}
            />
            <div>
              <Popover placement="bottom">
                <PopoverTrigger>
                  <Button
                    className="bg-default-100 text-default-800"
                    size="sm"
                    startContent={
                      <Icon
                        className="text-default-400"
                        icon="solar:tuning-2-linear"
                        width={16}
                      />
                    }
                  >
                    Φίλτρα
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="flex w-full flex-col gap-6 px-2 py-4">
                    <RadioGroup
                      label="Payment Method"
                      value={paymentMethodFilter}
                      color={"secondary"}
                      onValueChange={setPaymentMethodFilter}
                      className="font-sans tracking-wide"
                    >
                      <Radio value="all">Όλα</Radio>
                      <Radio value="creditcard"> Πιστωτική</Radio>
                      <Radio value="cash">Μετρητά</Radio>
                      <Radio value="bank">Τραπεζικό Έμβασμα</Radio>
                    </RadioGroup>

                    <RadioGroup
                      label="Κατάσταση"
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                      color={"secondary"}
                      className="font-sans tracking-wide"
                    >
                      <Radio value="all">Όλα</Radio>
                      <Radio value="pending">Εκκρεμεί</Radio>
                      <Radio value="paid">Πληρωμένο</Radio>
                      <Radio value="overdue">Ληξιπρόθεσμο</Radio>
                    </RadioGroup>

                    <RadioGroup
                      label="Ημερομηνία"
                      value={dateFilter}
                      onValueChange={setDateFilter}
                      color={"secondary"}
                      className="font-sans tracking-wide"
                    >
                      <Radio value="all">Όλα</Radio>
                      <Radio value="last7Days">Τελευταίες 7 ημέρες</Radio>
                      <Radio value="last30Days">Τελευταίες 30 ημέρες</Radio>
                      <Radio value="last60Days">Τελευταίες 60 ημέρες</Radio>
                    </RadioGroup>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="bg-default-100 text-default-800"
                    size="sm"
                    startContent={
                      <Icon
                        className="text-default-400"
                        icon="solar:sort-linear"
                        width={16}
                      />
                    }
                  >
                    Ταξινόμηση
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Sort"
                  items={headerColumns.filter(
                    (c) => !["actions"].includes(c.uid)
                  )}
                  className="font-sans tracking-wide"
                >
                  {(item) => (
                    <DropdownItem
                      key={item.uid}
                      onPress={() => {
                        setSortDescriptor({
                          column: item.uid,
                          direction:
                            sortDescriptor.direction === "ascending"
                              ? "descending"
                              : "ascending",
                        });
                      }}
                    >
                      {item.name}
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
            <div>
              <Dropdown closeOnSelect={false}>
                <DropdownTrigger>
                  <Button
                    className="bg-default-100 text-default-800"
                    size="sm"
                    startContent={
                      <Icon
                        className="text-default-400"
                        icon="solar:sort-horizontal-linear"
                        width={16}
                      />
                    }
                  >
                    Στήλες
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Columns"
                  items={expenseColumns
                    .filter((c) => !["actions"].includes(c.uid))
                    .map((item) => ({ ...item, key: item.uid }))}
                  selectedKeys={visibleColumns}
                  selectionMode="multiple"
                  onSelectionChange={setVisibleColumns}
                  className="font-sans tracking-wide"
                >
                  {(item) => (
                    <DropdownItem key={item.uid}>{item.name}</DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>

          <Divider className="h-5" orientation="vertical" />

          <div className="whitespace-nowrap text-sm text-default-800">
            {filterSelectedKeys === "all"
              ? "Όλα Επιλεγμένα"
              : `${filterSelectedKeys.size} Επιλεγμένα`}
          </div>

          {(filterSelectedKeys === "all" || filterSelectedKeys.size > 0) && (
            <Dropdown>
              <DropdownTrigger>
                <Button
                  className="bg-default-100 text-default-800"
                  endContent={
                    <Icon
                      className="text-default-400"
                      icon="solar:alt-arrow-down-linear"
                    />
                  }
                  size="sm"
                  variant="flat"
                >
                  Επιλεγμένες Ενέργειες
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Selected Actions"
                className="font-sans tracking-wide"
              >
                <DropdownItem
                  key="delete-expense"
                  onPress={() => {
                    setType("delete");
                    setIsOpen(true);
                  }}
                >
                  ΔΙΑΓΡΑΦΗ ΕΞΟΔΩΝ
                </DropdownItem>
                <DropdownItem key="mark-paid">ΠΛΗΡΩΘΗΚΕ</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    filterSelectedKeys,
    headerColumns,
    sortDescriptor,
    statusFilter,
    paymentMethodFilter,
    dateFilter,
    setPaymentMethodFilter,
    setStatusFilter,
    setDateFilter,
    onSearchChange,
    setVisibleColumns,
  ]);

  const topBar = useMemo(() => {
    return (
      <div className="mb-[18px] flex items-center justify-between">
        <div className="flex w-[320px] items-center gap-2">
          <h1 className="text-2xl font-[700] leading-[32px]">
            ΔΙΑΧΕΙΡΙΣΗ ΕΞΟΔΩΝ
          </h1>
          <Chip
            className="hidden items-center text-default-500 sm:flex"
            size="sm"
            variant="flat"
          >
            {expenses.length}
          </Chip>
        </div>
        <div className="flex gap-2">
          <Button
            color="warning"
            endContent={<Icon icon="solar:add-circle-bold" width={20} />}
            onPress={() => {
              setType("category");
              setIsOpen(true);
            }}
          >
            ΠΡΟΣΘΗΚΗ ΚΑΤΗΓΟΡΙΑΣ
          </Button>
          <Button
            color="secondary"
            endContent={<Icon icon="solar:add-circle-bold" width={20} />}
            onPress={() => {
              resetStore();
              setType("create");
              setIsOpen(true);
            }}
          >
            ΠΡΟΣΘΗΚΗ ΕΞΟΔΟΥ
          </Button>
        </div>
      </div>
    );
  }, [expense]);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex flex-col items-center justify-between gap-2 p-2 sm:flex-row">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="flex items-center justify-end gap-6">
          <span className="text-small text-default-400">
            {filterSelectedKeys === "all"
              ? "Ολα τα στοιχεία επιλέχθηκαν"
              : `${filterSelectedKeys.size} από ${filteredItems.length} επιλέχθηκαν`}
          </span>
          <div className="flex items-center gap-3">
            <Button
              isDisabled={page === 1}
              size="sm"
              variant="flat"
              onPress={onPreviousPage}
            >
              Προηγούμενη
            </Button>
            <Button
              isDisabled={page === pages}
              size="sm"
              variant="flat"
              onPress={onNextPage}
            >
              Επόμενη
            </Button>
          </div>
        </div>
      </div>
    );
  }, [
    filterSelectedKeys,
    page,
    pages,
    filteredItems.length,
    onPreviousPage,
    onNextPage,
  ]);

  const handleMemberClick = useMemoizedCallback(() => {
    setSortDescriptor({
      column: "description",
      direction:
        sortDescriptor.direction === "ascending" ? "descending" : "ascending",
    });
  });
  const handleEditClick = useMemoizedCallback((expense) => {
    setExpense(expense);
    setType("edit");
    setIsOpen(true);
  });

  return (
    <>
      <div className="h-full w-full p-6">
        {topBar}
        <Table
          isHeaderSticky
          aria-label="Example table with custom cells, pagination and sorting"
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={{
            td: "before:bg-transparent",
          }}
          selectedKeys={filterSelectedKeys}
          selectionMode="multiple"
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSelectionChange={onSelectionChange}
          onSortChange={setSortDescriptor}
          color="secondary"
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "end" : "start"}
                className={cn([
                  column.uid === "actions"
                    ? "flex items-center justify-end px-[20px]"
                    : "",
                ])}
              >
                {column.uid === "description" ? (
                  <div
                    {...getDescriptionProps()}
                    className="flex w-full cursor-pointer items-center justify-start gap-2"
                  >
                    {column.name}
                    {column.sortDirection === "ascending" ? (
                      <ArrowUpIcon className="text-default-400" />
                    ) : (
                      <ArrowDownIcon className="text-default-400" />
                    )}
                  </div>
                ) : column.info ? (
                  <div className="flex min-w-[108px] items-center justify-between">
                    {column.name}
                    <Tooltip content={column.info}>
                      <Icon
                        className="text-default-300"
                        height={16}
                        icon="solar:info-circle-linear"
                        width={16}
                      />
                    </Tooltip>
                  </div>
                ) : (
                  column.name
                )}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={"No expenses found"} items={sortedItems}>
            {(item) => (
              <TableRow key={item._id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
