"use server";
import Payment from "@/database/models/payment.model";
import { connectToDatabase } from "../mongoose";

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
