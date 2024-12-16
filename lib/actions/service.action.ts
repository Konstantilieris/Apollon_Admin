"use server";
import Service from "@/database/models/service.model";
import { connectToDatabase } from "../mongoose";
import { startOfMonth, endOfMonth } from "date-fns";
import Client from "@/database/models/client.model";
import { revalidatePath } from "next/cache";
import "moment/locale/el";
import mongoose from "mongoose";
import moment from "moment";
import FinancialSummary from "@/database/models/financial.model";
import Booking from "@/database/models/booking.model";

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
      {
        paid: true,
        paymentDate: new Date(),
        paidAmount: service.amount,
        remainingAmount: 0,
      },
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
          owesTotal: -service.remainingAmount,
          totalSpent: service.remainingAmount,
          points: service.remainingAmount,
        },
      },
      { new: true, session }
    );

    if (!client) {
      throw new Error("Client not found or update failed.");
    }
    if (service.bookingId) {
      await Booking.findByIdAndUpdate(
        service.bookingId,
        {
          $inc: {
            paidAmount: service.remaningAmount,
          },
        },
        { session }
      );
    }
    await FinancialSummary.findOneAndUpdate(
      {}, // Assuming a single document for financial summary
      { $inc: { totalRevenue: service.remainingAmount } }, // Increment total revenue
      { session } // Create if it doesn't exist
    );
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
        amountPerDay = (service.amount / numberOfDays).toFixed(3);
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
        fee.value = parseFloat(amount);
        serviceFeesUpdated = true;
      }
      return fee;
    });

    // If serviceType not found in serviceFees, push a new entry
    if (!serviceFeesUpdated) {
      client.serviceFees.push({ type: serviceType, value: parseFloat(amount) });
    }

    // Update servicePreferences if not already present
    if (!client.servicePreferences.includes(serviceType)) {
      client.servicePreferences.push(serviceType);
    }

    // Update owes and owesTotal
    client.owes.push(service[0]._id); // Using service[0] since create() returns an array
    client.owesTotal += parseFloat(amount);

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
export async function partialPayment({
  clientId,
  amount,
  path,
}: {
  clientId: string;
  amount: number;
  path: string;
}) {
  await connectToDatabase();
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    console.log("Starting partial payment process");

    // Fetch all unpaid services for the client, sorted by the smallest remaining amount
    const unpaidServices = await Service.find(
      { clientId, paid: false },
      {},
      { sort: { remainingAmount: 1 } }
    ).session(session);

    if (unpaidServices.length === 0) {
      throw new Error("No unpaid services found for the client.");
    }

    console.log(`Found ${unpaidServices.length} unpaid services.`);

    let remainingPayment = amount;
    let totalPaymentApplied = 0;

    // Apply payment to each unpaid service
    for (const service of unpaidServices) {
      console.log(
        `Processing service ${service._id}: Remaining amount: ${service.remainingAmount}, Paid amount: ${service.paidAmount}`
      );

      if (!service.remainingAmount || service.remainingAmount < 0) {
        throw new Error(`Service ${service._id} has invalid remainingAmount.`);
      }

      if (remainingPayment >= service.remainingAmount) {
        remainingPayment -= service.remainingAmount;
        totalPaymentApplied += service.remainingAmount;
        service.paidAmount = service.amount;
        service.remainingAmount = 0;
        service.paid = true;
        service.paymentDate = new Date();
      } else {
        service.paidAmount = (service.paidAmount || 0) + remainingPayment;
        service.remainingAmount = service.amount - service.paidAmount;
        totalPaymentApplied += remainingPayment;
        remainingPayment = 0;
      }

      console.log(
        `Updated service ${service._id}: Remaining amount: ${service.remainingAmount}, Paid amount: ${service.paidAmount}`
      );

      await service.save({ session });

      // Remove service from client's owes list if fully paid
      if (service.paid) {
        await Client.updateOne(
          { _id: clientId },
          { $pull: { owes: service._id } },
          { session }
        );
      }

      // Update booking if linked to the service
      if (service.bookingId) {
        const booking = await Booking.findById(service.bookingId).session(
          session
        );
        if (booking) {
          booking.paidAmount = (booking.paidAmount || 0) + service.paidAmount;
          await booking.save({ session });
        }
      }

      if (remainingPayment <= 0) break;
    }

    // Update client's credit, owesTotal, and totalSpent
    const client = await Client.findById(clientId).session(session);
    if (!client) {
      throw new Error("Client not found.");
    }

    console.log(
      `Updating client ${client._id}: OwesTotal: ${client.owesTotal}, TotalSpent: ${client.totalSpent}`
    );

    client.owesTotal = Math.max((client.owesTotal || 0) - totalPaymentApplied, 0);
    client.totalSpent = (client.totalSpent || 0) + totalPaymentApplied;

    if (remainingPayment > 0) {
      client.credit = (client.credit || 0) + remainingPayment;
    }

    await client.save({ session });

    console.log(
      `Client ${client._id} updated: OwesTotal: ${client.owesTotal}, TotalSpent: ${client.totalSpent}, Credit: ${client.credit}`
    );

    // Update financial summary
    await FinancialSummary.findOneAndUpdate(
      {},
      { $inc: { totalRevenue: totalPaymentApplied } },
      { session, upsert: true }
    );

    console.log(`Financial summary updated: TotalRevenue incremented by ${totalPaymentApplied}`);

    // Commit the transaction
    await session.commitTransaction();

    console.log("Partial payment transaction committed successfully.");

    // Revalidate the path
    revalidatePath(path);

    return { success: true, message: "Partial payment applied successfully." };
  } catch (error:any) {
    console.error("Error processing partial payment:", error);

    // Abort the transaction in case of an error
    await session.abortTransaction();

    return { success: false, message: error.message || "Failed to process partial payment." };
  } finally {
    session.endSession();
  }
}

export async function getPercentageIncrease() {
  try {
    await connectToDatabase(); // Ensure the database is connected

    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(startOfCurrentMonth.getTime() - 1);

    // Aggregate total revenue for paid services in the current and last month
    const result = await Service.aggregate([
      {
        $match: {
          paid: true,
          paymentDate: { $gte: startOfLastMonth }, // Services from the start of last month onwards
        },
      },
      {
        $addFields: {
          month: { $month: "$paymentDate" },
          year: { $year: "$paymentDate" },
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);

    // Extract totals for current and last month
    const currentMonthRevenue =
      result.find(
        (r) =>
          r._id.year === now.getFullYear() && r._id.month === now.getMonth() + 1
      )?.totalRevenue || 0;

    const lastMonthRevenue =
      result.find(
        (r) =>
          r._id.year === endOfLastMonth.getFullYear() &&
          r._id.month === endOfLastMonth.getMonth() + 1
      )?.totalRevenue || 0;

    // Calculate percentage increase
    const percentageIncrease =
      lastMonthRevenue > 0
        ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : currentMonthRevenue > 0
          ? 100
          : 0;

    return percentageIncrease;
  } catch (error) {
    console.error("Error calculating percentage increase:", error);
    throw new Error("Failed to calculate percentage increase");
  }
}
export async function updateTotalRevenue() {
  try {
    connectToDatabase(); // Connect to your database

    // Aggregate the total revenue from all paid services
    const totalRevenueResult = await Service.aggregate([
      {
        $match: { paid: true }, // Include only paid services
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" }, // Sum up the amounts
        },
      },
    ]);

    const totalRevenue = totalRevenueResult[0]?.totalRevenue || 0;

    // Update the FinancialSummary collection
    await FinancialSummary.findOneAndUpdate(
      {}, // Assuming a single document for financial summary
      { $set: { totalRevenue } }, // Update the totalRevenue field
      { upsert: true, new: true } // Create if it doesn’t exist, return the updated document
    );

    console.log(
      `FinancialSummary updated with total revenue: $${totalRevenue}`
    );
  } catch (error) {
    console.error("Error updating total revenue:", error);
    throw new Error("Failed to update total revenue.");
  }
}
export async function getTotalRevenue() {
  try {
    connectToDatabase(); // Connect to your database

    // Find the FinancialSummary document and return the totalRevenue field
    const financialSummary = await FinancialSummary.findOne();
    return financialSummary?.totalRevenue || 0;
  } catch (error) {
    console.error("Error fetching total revenue:", error);
    throw new Error("Failed to fetch total revenue.");
  }
}
export async function getAllServicesWithClientNames() {
  try {
    connectToDatabase(); // Connect to your database
    // Fetch all services and populate the client details
    const services = await Service.find()
      .populate({
        path: "clientId", // Field to populate
        select: "name", // Only include the 'name' field from the Client model
      })
      .exec();

    // Return the populated services
    return services.map((service) => ({
      id: service._id,
      serviceType: service.serviceType,
      amount: service.amount,
      date: service.date,
      paid: service.paid,
      paymentDate: service.paymentDate,
      clientName: service.clientId?.name || "Unknown Client",
      clientId: service.clientId._id, // Safely access the populated name
    }));
  } catch (error) {
    console.error("Error fetching services:", error);
    throw new Error("Failed to fetch services with client names.");
  }
}
export async function deleteSelectedService({ service, path, clientId }: any) {
  const session = await mongoose.startSession();

  try {
    connectToDatabase();
    session.startTransaction();
    await Service.findByIdAndDelete(service._id, { session });

    const client = await Client.findByIdAndUpdate(
      clientId,
      {
        $inc: { totalSpent: -service.amount },
      },
      { new: true, session }
    );
    if (!client) {
      throw new Error("Client not found.");
    }
    await FinancialSummary.findOneAndUpdate(
      {},
      { $inc: { totalRevenue: -service.amount } },
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    revalidatePath(path);
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error deleting service:", error);
    throw error;
  }
}
export async function createIncome({
  serviceType,
  notes,
  amount,
  date,
  path,
}: {
  serviceType: string;
  notes: string;
  amount: number;
  date: Date;
  path: string;
}) {
  const ADMIN_ID = "66c753da1234567800000014";
  const session = await mongoose.startSession();
  try {
    connectToDatabase();
    session.startTransaction();
    const service = await Service.create(
      {
        serviceType,
        notes,
        paid: true,
        remainingAmount: 0,
        paidAmount: amount,
        paymentDate: date,
        amount,
        date,
        clientId: ADMIN_ID,
      },
      { session }
    );
    await FinancialSummary.findOneAndUpdate(
      {},
      { $inc: { totalRevenue: amount } },
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    revalidatePath(path);
    return JSON.parse(JSON.stringify(service));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating income:", error);
    throw error;
  }
}
export async function getPaidServicesIncomeLast6Months() {
  try {
    const sixMonthsAgo = moment()
      .subtract(6, "months")
      .startOf("month")
      .toDate(); // Start of the 6th month

    const result = await Service.aggregate([
      {
        $match: {
          paid: true, // Only include paid services
          paymentDate: { $gte: sixMonthsAgo }, // Filter for the past 6 months
        },
      },
      {
        $group: {
          _id: { $month: "$paymentDate" }, // Group by the month of paymentDate
          totalIncome: { $sum: "$paidAmount" }, // Sum the paidAmount for each month
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month in ascending order
      },
    ]);

    // Map result to include month names
    const incomeByMonth = result.map((item) => ({
      month: moment()
        .month(item._id - 1)
        .format("MMMM"), // Convert month number to name
      totalIncome: item.totalIncome,
    }));

    return incomeByMonth;
  } catch (error) {
    console.error(`Error fetching paid services income:`, error);
    throw error;
  }
}
