import React from "react";
import { DefaultCircleSvg } from "./default-circle";
import { SuccessCircleSvg } from "./success-circle";
import { DangerCircleSvg } from "./danger-circle";

// Define expense status options to match the expense model ("pending", "paid", "overdue")
export const expenseStatusOptions = [
  { name: "pending", uid: "pending" },
  { name: "paid", uid: "paid" },
  { name: "overdue", uid: "overdue" },
] as const;

export type ExpenseStatus = (typeof expenseStatusOptions)[number]["name"];

// Map each expense status to an icon
export const expenseStatusColorMap: Record<ExpenseStatus, React.JSX.Element> = {
  pending: DefaultCircleSvg, // Neutral/default icon for pending expenses
  paid: SuccessCircleSvg, // A success icon for paid expenses
  overdue: DangerCircleSvg, // A danger icon to indicate overdue expenses
};
export type Expense = {
  _id: string;
  date: Date;
  description: string;
  category: {
    name: string;
    _id: string;
  };
  amount: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: string;
  vendor: {
    name: string;
    address: string;
    serviceType: string;
    contactInfo: string;
  };
  status: ExpenseStatus;
  notes: string;
};
// Define table column keys based on the expense model fields
export type ExpenseColumnsKey =
  | "date"
  | "description"
  | "category"
  | "amount"
  | "taxAmount"
  | "totalAmount"
  | "paymentMethod"
  | "vendor"
  | "status"
  | "notes"
  | "actions";

// Set the initial visible columns for an expenses table
export const INITIAL_VISIBLE_EXPENSE_COLUMNS: ExpenseColumnsKey[] = [
  "date",
  "description",
  "category",
  "amount",
  "taxAmount",
  "totalAmount",
  "paymentMethod",
  "vendor",
  "status",
  "actions",
];

// Define the column configuration for rendering in a table UI
export const expenseColumns = [
  { name: "Ημερομηνία", uid: "date" },
  { name: "Περιγραφή", uid: "description", sortDirection: "ascending" },
  { name: "Κατηγορία", uid: "category", sortDirection: "ascending" },
  { name: "Σύνολο", uid: "amount" },
  { name: "Φόρος", uid: "taxAmount" },
  { name: "Τελικό Ποσό", uid: "totalAmount" },
  { name: "Τρόπος Πληρωμής", uid: "paymentMethod" },
  { name: "Προμηθευτής", uid: "vendor" },
  { name: "Κατάσταση", uid: "status", info: "Κατάσταση δαπάνης" },
  { name: "Σημειώσεις", uid: "notes" },
  { name: "Ενέργειες", uid: "actions" },
];
