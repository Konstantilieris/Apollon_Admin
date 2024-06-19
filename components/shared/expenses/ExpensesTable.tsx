import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatDateString } from "@/lib/utils";
import ExpenseActions from "./ExpenseActions";

const ExpensesTable = ({ expenses }: { expenses: any }) => {
  return (
    <Table className="text-dark400_light700 font-noto_sans ">
      <TableHeader className="  border-b-8 border-light-700  bg-white  text-base font-semibold text-black dark:border-dark-400 dark:bg-slate-700 dark:text-light-700 xl:text-lg">
        <TableRow>
          <TableHead className="ml-2 text-start max-md:hidden">
            Ενέργειες
          </TableHead>
          <TableHead className="px-2">Όνομα</TableHead>

          <TableHead className="text-center">Περιγραφή</TableHead>
          <TableHead className="px-2">Κόστος</TableHead>
          <TableHead className="px-2">Ημερομηνία</TableHead>
          <TableHead className="px-2 text-center max-md:hidden">
            Εικονίδιο
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="mt-2">
        {expenses?.map((expense: any) => (
          <TableRow
            key={expense?._id}
            className={cn(
              "font-noto_sans background-light800_dark300 text-dark100_light900"
            )}
          >
            <TableCell className="max-w-[250px] pl-4 pr-10 text-base font-normal ">
              <ExpenseActions expense={expense} />
            </TableCell>
            <TableCell className="max-w-[250px] pl-4 pr-10 text-base font-normal ">
              {expense?.category.sub.name}
            </TableCell>
            <TableCell className="ml-4  flex max-w-[500px] justify-center truncate pr-10 text-center text-base font-normal 2xl:max-w-[600px]">
              {expense?.description}
            </TableCell>
            <TableCell className="pl-4 pr-10  text-base font-normal ">
              {expense?.amount} €
            </TableCell>
            <TableCell className=" pl-4 pr-10 text-base font-normal ">
              {formatDateString(expense?.date)}
            </TableCell>
            <TableCell className=" flex w-full max-w-[250px] items-end justify-center max-md:hidden">
              <span
                className="flex-center h-fit rounded-full p-4 text-xl "
                style={{ backgroundColor: expense.category.sub.color }}
              >
                {expense?.category?.sub?.icon}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ExpensesTable;
