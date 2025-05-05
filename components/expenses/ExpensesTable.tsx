"use client";

import React, { useMemo, useRef, useState } from "react";
import type { Selection } from "@heroui/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  useButton,
  cn,
} from "@heroui/react";
import Pagination from "@/components/shared/Pagination";
import {
  Expense,
  expenseColumns,
  INITIAL_VISIBLE_EXPENSE_COLUMNS,
} from "./data";
import { Icon } from "@iconify/react";
import { EditLinearIcon } from "./edit";
import { ArrowDownIcon } from "./arrow-down";
import { ArrowUpIcon } from "./arrow-up";
import { Status } from "./Status";
import { useExpensesStore } from "@/hooks/expenses-store";
import { useUrlSortDescriptor } from "@/hooks/useUrlSortDescriptor";
import TopContent from "./ExpensesControls/TopContent";

export interface ExpensesTableProps {
  initialData: any[];
  totalPages: number;
  totalAmount: number;
}

const ExpensesTable: React.FC<ExpensesTableProps> = ({
  initialData,
  totalPages,
  totalAmount,
}) => {
  /* ---------------- state ---------------- */
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_EXPENSE_COLUMNS)
  );

  const { sortDescriptor } = useUrlSortDescriptor("date", "descending");

  const { setExpense, setToDeleteExpenses, setType, setIsOpen } =
    useExpensesStore();

  /* ---------------- helpers ---------------- */
  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return expenseColumns;

    return expenseColumns
      .map((item) => {
        if (item.uid === sortDescriptor.column) {
          return { ...item, sortDirection: sortDescriptor.direction } as any;
        }
        return item;
      })
      .filter((c) => Array.from(visibleColumns).includes(c.uid));
  }, [visibleColumns, sortDescriptor]);

  /* ---------------- cell renderer ---------------- */
  const paymentMethodLabel: Record<string, string> = {
    credit_card: "Πιστωτική",
    cash: "Μετρητά",
    bank_transfer: "Τραπεζικό Έμβασμα",
  };

  const editRef = useRef<HTMLButtonElement | null>(null);
  const { getButtonProps } = useButton({ ref: editRef });

  const renderCell = (expense: Expense, columnKey: React.Key) => {
    switch (columnKey) {
      case "date":
        return (
          <div className="flex items-center gap-1">
            <Icon
              icon="solar:calendar-minimalistic-linear"
              className="h-4 w-4 text-default-300"
            />
            <p className=" text-base capitalize text-default-foreground">
              {new Intl.DateTimeFormat("el-GR", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }).format(new Date(expense.date))}
            </p>
          </div>
        );
      case "category": {
        const name =
          typeof expense.category === "object" &&
          expense.category &&
          "name" in expense.category
            ? (expense.category as any).name
            : String(expense.category);
        return <div className="text-base text-default-foreground">{name}</div>;
      }
      case "amount":
        return (
          <div className="text-base text-default-foreground">
            {expense.amount}€
          </div>
        );
      case "taxAmount":
        return (
          <div className="text-base text-default-foreground">
            {expense.taxAmount ?? 0} %
          </div>
        );
      case "totalAmount":
        return (
          <div className="text-base font-semibold text-default-foreground">
            {expense.totalAmount.toFixed(2)} €
          </div>
        );
      case "notes":
        return (
          <div className="text-base font-semibold text-default-foreground">
            {expense.notes}
          </div>
        );
      case "paymentMethod":
        return (
          <div className="text-base text-default-foreground">
            {expense.paymentMethod
              ? paymentMethodLabel[expense.paymentMethod.replace(" ", "_")]
              : ""}
          </div>
        );
      case "vendor": {
        const v = expense.vendor;
        return v ? (
          <div className="flex flex-col">
            <span className="text-small text-default-foreground">{v.name}</span>
            {v.contactInfo && (
              <span className="text-base text-default-500">
                {v.contactInfo}
              </span>
            )}
            {v.serviceType && (
              <span className="text-base text-default-500">
                {v.serviceType}
              </span>
            )}
          </div>
        ) : (
          <div className="text-small text-default-foreground">-</div>
        );
      }
      case "status":
        return <Status status={expense.status} />;
      case "actions":
        return (
          <div className="flex items-center justify-end pr-5">
            <EditLinearIcon
              {...getButtonProps()}
              className="cursor-pointer text-green-500"
              width={24}
              height={24}
              onClick={() => {
                setExpense(expense);
                setType("edit");
                setIsOpen(true);
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  /* ---------------- selection handler ---------------- */
  const onSelectionChange = (keys: Selection) => {
    setSelectedKeys(keys);
    const ids =
      keys === "all"
        ? initialData.map((e) => String(e._id))
        : Array.from(keys as Set<string>);
    setToDeleteExpenses(initialData.filter((e) => ids.includes(String(e._id))));
  };

  /* ---------------- render ---------------- */
  return (
    <div className="h-full w-full p-6">
      <Table
        isHeaderSticky
        aria-label="Expenses table"
        bottomContent={<Pagination totalPages={totalPages} />}
        bottomContentPlacement="outside"
        isStriped
        classNames={{ td: "before:bg-transparent text-base", th: "text-base" }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        topContent={
          <TopContent
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
            headerColumns={headerColumns}
            filterSelectedKeys={selectedKeys}
            initialData={initialData}
            totalAmount={totalAmount}
          />
        }
        topContentPlacement="outside"
        onSelectionChange={onSelectionChange as any}
        color="secondary"
      >
        <TableHeader columns={headerColumns}>
          {(col) => (
            <TableColumn
              key={col.uid}
              align={col.uid === "actions" ? "end" : "start"}
              className={cn([
                col.uid === "actions"
                  ? "flex items-center justify-end px-[20px]"
                  : "",
              ])}
            >
              {col.uid === "category" ? (
                <div className="flex w-full cursor-pointer items-center gap-2">
                  {col.name}
                  {col.sortDirection === "ascending" ? (
                    <ArrowUpIcon className="text-default-400" />
                  ) : (
                    <ArrowDownIcon className="text-default-400" />
                  )}
                </div>
              ) : col.info ? (
                <div className="flex min-w-[108px] items-center justify-between">
                  {col.name}
                  <Tooltip content={col.info}>
                    <Icon
                      icon="solar:info-circle-linear"
                      width={16}
                      height={16}
                      className="text-default-300"
                    />
                  </Tooltip>
                </div>
              ) : (
                col.name
              )}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent="No expenses found" items={initialData}>
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
  );
};

export default ExpensesTable;
