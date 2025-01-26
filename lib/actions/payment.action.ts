"use server";
import Payment from "@/database/models/payment.model";
import { connectToDatabase } from "../mongoose";
import FinancialSummary from "@/database/models/financial.model";
import { revalidatePath } from "next/cache";

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
export async function getAllPayments({ reverse }: { reverse: boolean }) {
  connectToDatabase();
  console.log(reverse);
  try {
    const payments = await Payment.find({ reversed: reverse })
      .sort({ date: -1 })
      .populate("clientId", "name")
      .populate({ path: "serviceId", select: "serviceType" })
      .populate({ path: "allocations.serviceId", select: "serviceType" });
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
