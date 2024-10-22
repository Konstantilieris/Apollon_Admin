"use server";
import Service from "@/database/models/service.model";
import { connectToDatabase } from "../mongoose";
import { startOfMonth, endOfMonth } from "date-fns";
import Client from "@/database/models/client.model";
import { revalidatePath } from "next/cache";

import mongoose from "mongoose";
import moment from "moment";

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
export async function getRevenueData() {
  // Get the start and end of the previous month
  const startOfLastMonth = moment()
    .subtract(1, "month")
    .startOf("month")
    .toDate();
  const endOfNextMonth = moment().add(1, "month").endOf("month").toDate();

  try {
    // Query the database with population of bookingId to get toDate and fromDate
    const services = await Service.aggregate([
      {
        $match: {
          date: {
            $gte: startOfLastMonth,
            $lte: endOfNextMonth,
          },
        },
      },
      {
        $lookup: {
          from: "bookings", // The collection name of your Booking model
          localField: "bookingId", // The field in Service that references Booking
          foreignField: "_id", // The field in Booking that is being referenced
          as: "booking", // Alias for the joined Booking data
        },
      },
      {
        $unwind: {
          path: "$booking",
          preserveNullAndEmptyArrays: true, // Preserve services without a booking
        },
      },
    ]);

    // Initialize an object to store the daily revenue data
    const revenueData: { [date: string]: number } = {};

    // Iterate over each service
    services.forEach((service) => {
      let startDate = service.date; // Default to service's own date
      let endDate = service.date;
      let amountPerDay = service.amount;

      // Only perform daily division if the serviceType is 'Διαμονή' and has a booking
      if (service.serviceType === "ΔΙΑΜΟΝΗ" && service.booking) {
        startDate = service.booking.fromDate;
        endDate = service.booking.toDate;

        // Calculate the number of days between fromDate and toDate
        const numberOfDays =
          moment(endDate).diff(moment(startDate), "days") + 1;

        // Divide the amount by the number of days
        amountPerDay = (service.amount / numberOfDays).toFixed(2);
      }

      // Loop through each day between fromDate and toDate (or just the service's own date if no booking)
      const currentDate = moment(startDate).subtract(1, "day");
      const end = moment(endDate).subtract(1, "day");
      while (currentDate.isSameOrBefore(end)) {
        const dateKey = currentDate.format("YYYY-MM-DD");

        // Add the daily revenue to the revenueData object
        if (!revenueData[dateKey]) {
          revenueData[dateKey] = 0;
        }
        revenueData[dateKey] += parseFloat(amountPerDay);

        // Move to the next day
        currentDate.add(1, "day");
      }
    });

    return revenueData;
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    throw error;
  }
}
export async function chargeClient({
  serviceType,
  amount,
  clientId,
  date,
  notes,
}: any) {
  // Start a session for the transaction
  const session = await mongoose.startSession();

  try {
    session.startTransaction(); // Start transaction

    // Connect to database
    await connectToDatabase();

    // Create the service within the transaction
    const service = await Service.create(
      [
        {
          serviceType,
          amount: parseFloat(amount),
          clientId,
          date,
          notes,
        },
      ],
      { session }
    );

    if (!service) {
      throw new Error("Service not created successfully");
    }

    // Find the client within the transaction
    const client = await Client.findById(clientId).session(session);

    if (!client) {
      throw new Error("Client not found.");
    }

    // Update serviceFees
    let serviceFeesUpdated = false;
    client.serviceFees = client.serviceFees.map((fee: any) => {
      if (fee.type === serviceType) {
        fee.value += amount; // Update the value if serviceType exists
        serviceFeesUpdated = true;
      }
      return fee;
    });

    // If serviceType not found in serviceFees, push a new entry
    if (!serviceFeesUpdated) {
      client.serviceFees.push({ type: serviceType, value: amount });
    }

    // Update servicePreferences if not already present
    if (!client.servicePreferences.includes(serviceType)) {
      client.servicePreferences.push(serviceType);
    }

    // Update owes and owesTotal
    client.owes.push(service[0]._id); // Using service[0] since create() returns an array
    client.owesTotal += amount;

    // Save updated client within the transaction
    await client.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    revalidatePath(`/clients/${clientId}/service`);
    revalidatePath(`/clients/${clientId}`);
    return JSON.stringify(service[0]); // Return the created service
  } catch (error) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    session.endSession();
    console.error("Error charging client:", error);
    throw error;
  }
}
