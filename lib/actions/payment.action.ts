"use server";
import Payment from "@/database/models/payment.model";
// eslint-disable-next-line no-unused-vars
import Client from "@/database/models/client.model";
import { connectToDatabase } from "../mongoose";
import FinancialSummary from "@/database/models/financial.model";
import { revalidatePath } from "next/cache";
import { PaymentRow } from "@/types";

export async function getPaymentsByClientId({
  clientId,
}: {
  clientId: string;
}) {
  connectToDatabase();
  try {
    const payments = await Payment.find({ clientId })
      .sort({ date: -1 })
      .populate("clientId", "name")
      .populate({
        path: "serviceId", // Populate the `serviceId` field
        select: "serviceType", // Include only the `serviceType` field
      })
      .populate({
        path: "allocations.serviceId", // Populate `serviceId` inside the `allocations` array
        select: "serviceType", // Include only the `serviceType` field
      });
    if (!payments) {
      throw new Error("No payments found.");
    }
    return JSON.parse(JSON.stringify(payments));
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch payments.");
  }
}

// financial summary

export async function getTotalRevenue() {
  connectToDatabase();
  try {
    const financial: any = await FinancialSummary.find();
    if (!financial) {
      throw new Error("No payments found.");
    }

    return financial[0].totalRevenue;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch payments.");
  }
}
export async function syncFinancialSummary() {
  connectToDatabase();
  try {
    const payments = await Payment.find({ reversed: false });
    const totalRevenue = payments.reduce(
      (acc, payment) => acc + payment.amount,
      0
    );
    const financial = await FinancialSummary.findOneAndUpdate(
      {},
      { totalRevenue },
      { new: true }
    );
    if (!financial) {
      throw new Error("No financial summary found.");
    }
    revalidatePath("/payments");
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message || "Failed to sync financial summary.");
  }
}
export interface GetPaymentsFilters {
  clientName?: string;
  from?: Date;
  to?: Date;
  reversed?: boolean;
  sortDir?: "asc" | "desc";
  page?: number; // ← new
  limit?: number; // ← new
}
export interface PagedPayments {
  rows: PaymentRow[];
  totalCount: number;
}
export async function getAllPayments(
  filters: GetPaymentsFilters
): Promise<PagedPayments> {
  await connectToDatabase();

  const {
    clientName,
    from,
    to,
    reversed,
    sortDir = "desc",
    page = 1, // default if not passed
    limit = 10, // always 10 per your spec
  } = filters;

  const query: any = {};
  if (typeof reversed === "boolean") query.reversed = reversed;
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = from;
    if (to) query.date.$lte = to;
  }

  // count before pagination
  const totalCount = await Payment.countDocuments(query);

  let payments = await Payment.find(query)
    .sort({ date: sortDir === "asc" ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate({ path: "clientId", select: "name" })
    .populate({ path: "serviceId", select: "serviceType endDate date" })
    .populate({ path: "allocations.serviceId", select: "serviceType" })
    .lean();

  if (clientName) {
    const regex = new RegExp(clientName, "i");
    payments = payments.filter((p: any) => p.clientId?.name?.match(regex));
  }

  const rows = payments.map((p: any) => ({
    id: p._id.toString(),
    date: p.date,
    clientName: p.clientId?.name ?? "",
    service: p.serviceId
      ? {
          id: p.serviceId._id.toString(),
          serviceType: p.serviceId.serviceType,
          date: p.serviceId.date,
          endDate: p.serviceId.endDate,
        }
      : undefined,
    amount: p.amount,
    notes: p.notes,
    reversed: p.reversed,
    allocations: p.allocations.map((a: any) => ({
      id: a.serviceId._id.toString(),
      serviceType: a.serviceId.serviceType,
      amount: a.amount,
    })),
  }));

  return { rows, totalCount };
}
