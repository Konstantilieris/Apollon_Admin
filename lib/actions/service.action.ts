"use server";
import Service from "@/database/models/service.model";
import { connectToDatabase } from "../mongoose";
import { startOfMonth, endOfMonth } from "date-fns";
import Client from "@/database/models/client.model";
import { revalidatePath } from "next/cache";
import path from "path";
import mongoose from "mongoose";

export async function getMonthlyIncome() {
  const startDate = startOfMonth(new Date());
  const endDate = endOfMonth(new Date());
  connectToDatabase();

  const result = await Service.aggregate([
    {
      $match: {
        paymentDate: {
          $gte: startDate,
          $lt: endDate,
        },
        paid: true,
      },
    },
    {
      $group: {
        _id: null,
        totalIncome: { $sum: "$amount" },
      },
    },
  ]);

  return result[0]?.totalIncome || 0;
}

export async function chargeClient({
  clientId,
  path,
  serviceType,
  amount,
  date,
}: any) {
  try {
    connectToDatabase();

    const service = await Service.create({
      serviceType,
      clientId,
      amount: +amount,
    });
    if (service) {
      const client = await Client.findByIdAndUpdate(
        clientId,
        { $push: { owes: service._id } },
        { new: true }
      );
      if (client) {
        revalidatePath(path);
        return JSON.parse(JSON.stringify(client));
      } else {
        throw new Error("Client not found");
      }
    }
  } catch (error) {
    console.error("Error charging client:", error);
    throw error;
  }
}
export async function payOffClient({ path, serviceId }: any) {
  try {
    connectToDatabase();
    const service = await Service.findByIdAndUpdate(
      { _id: serviceId },
      { paid: true, paymentDate: new Date() },
      { new: true }
    );
    if (!service) {
      throw new Error("Service not found");
    } else {
      revalidatePath(path);
      return JSON.parse(JSON.stringify(service));
    }
  } catch (error) {
    console.error("Error paying off client:", error);
    throw error;
  }
}
export async function uncheckedPayment({ serviceId, path }: any) {
  try {
    connectToDatabase();
    const service = await Service.findByIdAndUpdate(
      { _id: serviceId },
      { paid: false, paymentDate: null },
      { new: true }
    );
    if (!service) {
      throw new Error("Service not found");
    } else {
      revalidatePath(path);
      return JSON.parse(JSON.stringify(service));
    }
  } catch (error) {
    console.error("Error unchecking payment:", error);
    throw error;
  }
}
export async function getUnpaidClientServices({ clientId }: any) {
  try {
    connectToDatabase();
    const services = await Service.find(
      {
        clientId,
        paid: false,
      },
      {},
      { sort: { date: -1 } }
    );
    return JSON.parse(JSON.stringify(services));
  } catch (error) {
    console.error("Error getting unpaid client services:", error);
    throw error;
  }
}
export async function getAllPaidClientServices({ clientId }: any) {
  try {
    connectToDatabase();
    const services = await Service.find(
      {
        clientId,
        paid: true,
      },
      {},
      { sort: { paid: 1, date: -1 } }
    );
    return JSON.parse(JSON.stringify(services));
  } catch (error) {
    console.error("Error getting all client services:", error);
    throw error;
  }
}
export async function payService({ service, path }: any) {
  const session = await mongoose.startSession();
  try {
    await connectToDatabase();
    session.startTransaction();

    // Ensure service exists and is unpaid
    const newService = await Service.findOneAndUpdate(
      { _id: service._id, paid: false, serviceType: service.serviceType },
      { paid: true, paymentDate: new Date() },
      { new: true, session }
    );

    // Log the service amount to ensure it's a valid number
    console.log("Service Amount:", service.amount);

    if (!newService) {
      throw new Error("Service not found or already paid.");
    }

    // Update client details and log the result to check for issues
    const client = await Client.findByIdAndUpdate(
      service.clientId,
      {
        $pull: { owes: service._id },
        $inc: {
          owesTotal: -service.amount,
          totalSpent: service.amount,
          points: service.amount,
        },
      },
      { new: true, session }
    );

    console.log("Client update result:", client);

    if (!client) {
      throw new Error("Client not found or update failed.");
    }

    // Commit the transaction if all updates succeed
    await session.commitTransaction();

    revalidatePath(path);
    return JSON.parse(JSON.stringify(service));
  } catch (error) {
    console.error("Error paying off client:", error);
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
