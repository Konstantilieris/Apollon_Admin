"use server";
import Service from "@/database/models/service.model";
import { connectToDatabase } from "../mongoose";
import { startOfMonth, endOfMonth } from "date-fns";
import Client from "@/database/models/client.model";
import { revalidatePath } from "next/cache";
import "moment/locale/el";

import moment from "moment";
import FinancialSummary from "@/database/models/financial.model";
import Booking from "@/database/models/booking.model";
import Payment from "@/database/models/payment.model";
import { deleteBooking } from "./booking.action";
import mongoose, { Types } from "mongoose";
import { ADMIN } from "@/constants";

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
    ).populate("bookingId"); // Populating the bookingId reference

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
    ).populate("bookingId"); // Populating the bookingId reference
    return JSON.parse(JSON.stringify(services));
  } catch (error) {
    console.error("Error getting all client services:", error);
    throw error;
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
          endDate: date,
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

    return JSON.stringify(service[0]); // Return the created service
  } catch (error) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    session.endSession();
    console.error("Error charging client:", error);
    throw error;
  }
}

export async function getPercentageIncrease() {
  try {
    await connectToDatabase(); // Ensure the database is connected

    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(startOfCurrentMonth.getTime() - 1);

    // Aggregate total revenue for payments in the current and last month
    const result = await Payment.aggregate([
      {
        $match: {
          reversed: false, // Exclude reversed payments
          date: { $gte: startOfLastMonth }, // Payments from the start of last month onwards
        },
      },
      {
        $addFields: {
          month: { $month: "$date" },
          year: { $year: "$date" },
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

export async function getPaymentsIncomeLast6Months() {
  try {
    const sixMonthsAgo = moment()
      .subtract(6, "months")
      .startOf("month")
      .toDate(); // Start of the 6th month

    const result = await Payment.aggregate([
      {
        $match: {
          reversed: false, // Exclude reversed payments
          date: { $gte: sixMonthsAgo }, // Filter for the past 6 months
        },
      },
      {
        $group: {
          _id: { $month: "$date" }, // Group by the month of payment date
          totalIncome: { $sum: "$amount" }, // Sum the payment amounts for each month
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
    console.error(`Error fetching payments income:`, error);
    throw error;
  }
}

export async function discountSelectedServices({
  services,
  discount,
  clientId,
  path,
}: {
  services: any[];
  discount: number[];
  clientId: string;
  path: string;
}) {
  const session = await mongoose.startSession();
  try {
    console.log("Discounting services...", services);
    console.log("Discount amounts:", discount);
    await connectToDatabase();
    session.startTransaction();

    // Calculate total reduction for the client's `owesTotal`
    const totalReduction = discount.reduce((acc, curr) => acc + curr, 0);

    // Apply discount to each service
    for (let i = 0; i < services.length; i++) {
      // Find and update the service with the discount
      const service = await Service.findById(services[i]._id).session(session);

      if (!service) {
        throw new Error("Service not found.");
      }

      // Update the discount field and trigger recalculation of `remainingAmount`
      service.discount = (service.discount || 0) + discount[i];

      // Save the updated service
      await service.save({ session });

      // Update the booking if the service has a `serviceType` of "ΔΙΑΜΟΝΗ"
      if (service.serviceType === "ΔΙΑΜΟΝΗ" && service.bookingId) {
        const booking = await Booking.findByIdAndUpdate(
          service.bookingId,
          { $inc: { totalAmount: -discount[i] } },
          { new: true, session }
        );

        if (!booking) {
          throw new Error("Booking not found.");
        }
      }
    }

    console.log("Services updated successfully.");
    console.log("Total reduction:", totalReduction);

    // Update the client's `owesTotal`
    const client = await Client.findByIdAndUpdate(
      clientId,
      { $inc: { owesTotal: -totalReduction } },
      { new: true, session }
    );

    if (!client) {
      throw new Error("Client not found.");
    }
    // update financial summary
    await FinancialSummary.findOneAndUpdate(
      {},
      { $inc: { totalRevenue: -totalReduction } },
      { session }
    );
    revalidatePath(path);
    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Revalidate the client view path
    revalidatePath(path);

    return { success: true, message: "Services discounted successfully." };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error discounting services:", error);
    throw error;
  }
}

export async function deleteSelectedService({ service, path, clientId }: any) {
  const session = await mongoose.startSession();

  try {
    connectToDatabase();
    session.startTransaction();

    /// this snippet is for the unpaid services lets say the admin wants to delete a service that has been fully paid

    // if the service has a booking ID call the deleteBooking function else delete the service
    if (service.paid) {
      // delete the payments that are related to the service and stand not reversed
      const deletedPayments = await Payment.deleteMany({
        serviceId: service._id,
        reversed: false,
      }).session(session);
      if (deletedPayments) {
        console.log("Payment deleted successfully");
      }
      const client = await Client.findByIdAndUpdate(
        clientId,
        {
          $inc: {
            totalSpent: -service.paidAmount,
            points: -service.paidAmount,
          },
        },
        { new: true, session }
      );
      if (client) {
        console.log("Client updated successfully");
      }
      await FinancialSummary.findOneAndUpdate(
        {},
        { $inc: { totalRevenue: -service.paidAmount } },
        { session }
      );
      await Service.findByIdAndDelete(service._id).session(session);
      await session.commitTransaction();
      session.endSession();
      return { message: "success" };
    }
    if (service.bookingId) {
      const booking = await deleteBooking({
        id: service.bookingId,
        clientId,
        path,
      });
      if (booking) {
        console.log("Booking deleted successfully");
        return { message: "success" };
      }
    }
    // deleting the service is not that simple as it has to be removed from the client's owes array
    // and the total owes amount has to be updated and the paid amount has to be deducted from the total spent amount
    // and the total revenue has to be updated
    if (!service.paid) {
      // 1. Find relevant Payment docs referencing this service
      //    (either by single `serviceId` or via allocations array)
      const payments = await Payment.find({
        reversed: false,
        $or: [
          { serviceId: service._id }, // single-service Payment
          { "allocations.serviceId": service._id }, // multi-service
        ],
      }).session(session);

      // We'll track how much money is effectively “undone”
      let removedAmount = 0;

      for (const payment of payments) {
        // CASE A: Single-service payment (payment.serviceId === service._id)
        if (
          payment.serviceId &&
          payment.serviceId.toString() === service._id.toString()
        ) {
          removedAmount += payment.amount;
          // Option: delete the entire payment
          await Payment.findByIdAndDelete(payment._id).session(session);
        } else {
          // CASE B: Multi-service payment using allocations
          const newAllocations = [];
          let removedFromThisPayment = 0;

          for (const alloc of payment.allocations || []) {
            if (alloc.serviceId.toString() === service._id.toString()) {
              removedFromThisPayment += alloc.amount;
            } else {
              newAllocations.push(alloc);
            }
          }

          if (removedFromThisPayment > 0) {
            removedAmount += removedFromThisPayment;
            payment.amount -= removedFromThisPayment;

            if (payment.amount <= 0 || newAllocations.length === 0) {
              // Payment is effectively empty now
              await Payment.findByIdAndDelete(payment._id).session(session);
            } else {
              // Save the trimmed allocations
              payment.allocations = newAllocations;
              await payment.save({ session });
            }
          }
        }
      }

      // 2. Update the client
      const client = await Client.findById(clientId).session(session);
      if (!client) {
        throw new Error("Client not found.");
      }

      // Remove this service from client.owes
      client.owes = client.owes.filter(
        (owe: any) => owe.toString() !== service._id.toString()
      );
      // Subtract the service's remaining amount from client.owesTotal
      client.owesTotal -= service.remainingAmount;
      // Subtract the undone paid portion from the client's totalSpent
      client.totalSpent -=
        service.paidAmount > removedAmount ? removedAmount : service.paidAmount;
      // ^ If you're confident that `service.paidAmount === removedAmount`, just do `-= removedAmount`

      await client.save({ session });

      // 3. Update FinancialSummary
      //    Subtract the removed portion from totalRevenue
      await FinancialSummary.findOneAndUpdate(
        {},
        { $inc: { totalRevenue: -removedAmount } },
        { session }
      );

      // 4. Finally, delete the service
      await Service.findByIdAndDelete(service._id).session(session);

      // 5. Commit transaction, etc.
      await session.commitTransaction();
      session.endSession();
      revalidatePath(path);

      return { message: "success" };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error deleting service:", error);
    throw error;
  }
}

export async function getAllServices({ paid = false }: { paid: boolean }) {
  connectToDatabase();
  try {
    const services = await Service.find({ paid })
      .sort({ date: -1 })
      .populate("clientId", "name");
    return JSON.parse(JSON.stringify(services));
  } catch (error) {
    console.error("Error fetching services:", error);
    throw new Error("Failed to fetch services.");
  }
}
export async function editNonBookingService({
  serviceId,
  path,
  amount,
  date,
}: {
  serviceId: string;
  amount: number;
  date: Date | string;
  path: string;
}) {
  try {
    if (!serviceId) {
      throw new Error("serviceId is required");
    }
    if (amount === undefined || amount === null) {
      throw new Error("amount is required");
    }
    if (!date) {
      throw new Error("date is required");
    }

    await connectToDatabase();

    // Validate amount
    const newAmount = Number(amount);
    if (isNaN(newAmount) || newAmount < 0) {
      throw new Error(
        "Invalid amount provided. Amount must be a positive number."
      );
    }

    // Validate date
    const newDate = new Date(date);
    if (isNaN(newDate.getTime())) {
      throw new Error("Invalid date format provided.");
    }

    // Retrieve the existing service
    const service = await Service.findById(serviceId);
    if (!service) {
      throw new Error("Service not found.");
    }

    // Check if the service has an associated booking
    if (service.bookingId) {
      throw new Error("Cannot edit a service that has an associated booking.");
    }

    // Fetch the associated client
    const client = await Client.findById(service.clientId);
    if (!client) {
      throw new Error("Associated client not found.");
    }

    // Store the old remainingAmount before update
    const oldRemainingAmount = service.remainingAmount ?? 0;

    // Update the service, triggering pre-hooks for recalculating fields
    const updatedService = await Service.findOneAndUpdate(
      { _id: serviceId },
      { amount: newAmount, date: newDate, endDate: newDate },
      { new: true, runValidators: true, context: "query" }
    );

    if (!updatedService) {
      throw new Error("Failed to update the service.");
    }

    // Get the new remainingAmount after update
    const newRemainingAmount = updatedService.remainingAmount ?? 0;

    // Adjust the client's owesTotal accordingly
    const difference = newRemainingAmount - oldRemainingAmount;
    client.owesTotal = Math.max((client.owesTotal ?? 0) + difference, 0);

    // Save the updated client
    await client.save();

    // Revalidate the path to ensure UI updates correctly
    try {
      revalidatePath(path);
    } catch (revalidationError) {
      console.warn("Path revalidation failed:", revalidationError);
    }

    return JSON.parse(JSON.stringify(updatedService));
  } catch (error: any) {
    console.error("Error editing non-booking service:", error.message);
    throw new Error(error.message || "Failed to edit the non-booking service.");
  }
}
interface UpdateTaxParams {
  selectedServiceIds: string[];
  taxRate: number;
  path: string;
}

export async function updateTaxForSelectedServices({
  selectedServiceIds,
  taxRate,
  path,
}: UpdateTaxParams) {
  await connectToDatabase();
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Fetch the services to update
    const services = await Service.find(
      { _id: { $in: selectedServiceIds } },
      {},
      { session }
    );

    if (services.length === 0) {
      throw new Error("No services found for the selected IDs.");
    }

    // We'll accumulate the difference between the new remaining amounts and the old ones.
    let totalDifference = 0;

    // Update taxRate on each service. The pre-save hook will recalc the derived fields.
    for (const service of services) {
      const oldRemaining = service.remainingAmount ?? 0;
      service.taxRate = taxRate;
      await service.save({ session });
      const newRemaining = service.remainingAmount ?? 0;
      totalDifference += newRemaining - oldRemaining;
    }

    // Update the client's owes total by adding the incremental difference.
    // We assume all selected services belong to the same client.
    const clientId = services[0].clientId;
    const client = await Client.findById(clientId).session(session);
    if (!client) {
      throw new Error("Client not found.");
    }
    client.owesTotal = (client.owesTotal || 0) + totalDifference;
    await client.save({ session });

    await session.commitTransaction();
    session.endSession();

    revalidatePath(path);

    return { success: true, message: "Tax updated successfully." };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error updating tax:", error);
    return {
      success: false,
      message: error.message || "Failed to update tax.",
    };
  }
}
export async function FinancialOverviewStats({
  clientId,
}: {
  clientId: string;
}) {
  try {
    await connectToDatabase(); // Connect to your database

    const [aggregationResult] = await Service.aggregate([
      {
        $match: {
          clientId: new Types.ObjectId(clientId),
          paid: false,
        },
      },
      {
        $group: {
          _id: null,
          services: { $push: "$$ROOT" },
          totalPaid: { $sum: "$paidAmount" },
          totalOwes: { $sum: "$remainingAmount" },
        },
      },
    ]);

    // If no results found, return defaults
    if (!aggregationResult) {
      return {
        services: [],
        totalPaid: 0,
        totalOwes: 0,
        progress: 0,
      };
    }

    const { services, totalPaid, totalOwes } = aggregationResult;
    const grandTotal = totalPaid + totalOwes;
    const progress = grandTotal === 0 ? 0 : (totalPaid / grandTotal) * 100;

    return {
      services,
      totalPaid,
      totalOwes,
      progress,
    };
  } catch (error) {
    console.error("Error in FinancialOverview:", error);

    // Return a safe fallback or rethrow
    return {
      services: [],
      totalPaid: 0,
      totalOwes: 0,
      progress: 0,
      error: (error as Error).message,
    };
  }
}
export async function updateService({
  serviceId,
  amount,
  date,
  serviceType,
  notes,
}: {
  serviceId: string;
  amount: number;
  notes: string;
  serviceType: string;
  date: Date | string;
}) {
  try {
    await connectToDatabase();
    const service = await Service.findById(serviceId);
    if (!service) {
      throw new Error("Service not found.");
    }
    service.notes = notes;
    service.amount = amount;
    service.date = new Date(date);
    service.serviceType = serviceType;

    await service.save(); // Middleware triggers here

    return JSON.parse(JSON.stringify(service));
  } catch (error: any) {
    console.error("Error updating service:", error.message);
    throw new Error("Failed to update the service.");
  }
}

export async function getServiceView({ serviceId }: any) {
  try {
    await connectToDatabase();

    // 1) Find the service
    const service = await Service.findById(serviceId).populate("bookingId");
    if (!service) {
      throw new Error("Service not found.");
    }

    // 2) Find all payments that relate to this service
    //    - Either by direct reference: payment.serviceId
    //    - Or within allocations: payment.allocations[].serviceId
    const payments = await Payment.find({
      $or: [
        { serviceId: service._id },
        { "allocations.serviceId": service._id },
      ],
    })
      // Populate the allocated service(s) to see exactly which portion went where
      .populate("allocations.serviceId");

    // 3) Convert results to plain JSON (for Next.js or any API response)
    return {
      service: JSON.stringify(service),
      payments: JSON.stringify(payments),
    };
  } catch (error: any) {
    console.error("Error fetching service view:", error.message);
    throw new Error("Failed to fetch the service view.");
  }
}

export async function getBookingServices({ bookingId }: { bookingId: string }) {
  try {
    await connectToDatabase();
    if (!bookingId) throw new Error("Booking ID is required.");

    /* 1️⃣  Services that belong to the booking */
    const services = await Service.find({ bookingId }).sort({ date: -1 });

    /* 2️⃣  Payments whose serviceId is in that list of services */

    return JSON.stringify(services);
  } catch (error: any) {
    console.error("Error fetching booking services and payments:", error);
    throw new Error("Failed to fetch booking services and payments.");
  }
}
// --------------------------------------Reverse for selected services-----------------------------------//

interface PartialPaymentParams {
  selectedServiceIds: string[];
  amount: number;
  path: string;
}
// --------------------------------------Payment for selected services-----------------------------------//
export async function partialPaymentSelected({
  selectedServiceIds,
  amount,
  path,
}: PartialPaymentParams) {
  if (amount <= 0) {
    return {
      success: false,
      message: "Payment amount must be greater than zero.",
    };
  }

  await connectToDatabase();
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Fetch only the selected services that are unpaid
    const services = await Service.find(
      { _id: { $in: selectedServiceIds }, paid: false },
      {},
      { sort: { remainingAmount: 1 } }
    ).session(session);

    if (services.length === 0) {
      throw new Error("No unpaid services found for the selected items.");
    }

    let remainingPayment = amount;
    let totalPaymentApplied = 0;
    const allocations = [];

    // Apply payment across the selected services
    for (const service of services) {
      if (!service.remainingAmount || service.remainingAmount < 0) {
        throw new Error(`Service ${service._id} has invalid remainingAmount.`);
      }

      // Determine how much can be applied to this service
      const servicePayment = Math.min(
        remainingPayment,
        service.remainingAmount
      );

      // Increase the paidAmount (pre-save hook will recalc remainingAmount, paid, etc.)
      service.paidAmount = (service.paidAmount || 0) + servicePayment;

      // Save service so that the pre-save hook recalculates derived fields
      await service.save({ session });

      allocations.push({
        serviceId: service._id,
        amount: servicePayment,
      });

      totalPaymentApplied += servicePayment;
      remainingPayment -= servicePayment;
      if (remainingPayment <= 0) break;
    }

    // Create a Payment record with the allocations
    const payment = new Payment({
      clientId: services[0].clientId, // assuming all services belong to the same client
      amount: totalPaymentApplied,
      notes: `Έναντι πληρωμή ${amount} εφαρμόζεται σε συγκεκριμένες υπηρεσίες`,
      allocations,
    });
    await payment.save({ session });

    // Update client details if needed
    const client = await Client.findById(services[0].clientId).session(session);
    if (!client) {
      throw new Error("Client not found.");
    }
    client.owesTotal = Math.max(
      (client.owesTotal || 0) - totalPaymentApplied,
      0
    );
    client.totalSpent = (client.totalSpent || 0) + totalPaymentApplied;
    await client.save({ session });

    // Update financial summary
    await FinancialSummary.findOneAndUpdate(
      {},
      { $inc: { totalRevenue: totalPaymentApplied } },
      { session, upsert: true }
    );

    await session.commitTransaction();
    session.endSession();

    // Revalidate the path if needed
    revalidatePath(path);

    return {
      success: true,
      message: `Partial payment of ${amount} applied successfully.`,
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error processing partial payment:", error);
    return {
      success: false,
      message: error.message || "Failed to process partial payment.",
    };
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
  if (amount <= 0) {
    return {
      success: false,
      message: "Payment amount must be greater than zero.",
    };
  }

  await connectToDatabase();
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    console.log(`Starting partial payment for client: ${clientId}`);

    // Fetch unpaid services for the client, sorted by smallest remaining amount
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

    const allocations = []; // To track payment allocations to services

    // Apply payment across services
    for (const service of unpaidServices) {
      if (!service.remainingAmount || service.remainingAmount < 0) {
        throw new Error(`Service ${service._id} has invalid remainingAmount.`);
      }

      const servicePayment = Math.min(
        remainingPayment,
        service.remainingAmount
      );

      // Update service details
      service.paidAmount = (service.paidAmount || 0) + servicePayment;
      service.remainingAmount = Math.max(
        (service.amount - service.discount || 0) - service.paidAmount,
        0
      );

      if (service.remainingAmount === 0) {
        service.paid = true;
        service.paymentDate = new Date();
        console.log(`Service ${service._id} fully paid.`);
      }

      // Track the allocation
      allocations.push({
        serviceId: service._id,
        amount: servicePayment,
      });

      await service.save({ session });

      totalPaymentApplied += servicePayment;
      remainingPayment -= servicePayment;

      // Break loop if payment is fully allocated
      if (remainingPayment <= 0) break;
    }

    // Create a single Payment record with allocations
    const payment = new Payment({
      clientId,
      amount: totalPaymentApplied,
      notes: `Μερική πληρωμή ${amount}  εφαρμόζεται σε όλες τις υπηρεσίες`,
      allocations,
    });

    await payment.save({ session });

    // Update client details
    const client = await Client.findById(clientId).session(session);
    if (!client) {
      throw new Error("Client not found.");
    }

    client.owesTotal = Math.max(
      (client.owesTotal || 0) - totalPaymentApplied,
      0
    );
    client.totalSpent = (client.totalSpent || 0) + totalPaymentApplied;

    if (remainingPayment > 0) {
      client.credit = (client.credit || 0) + remainingPayment;
      console.log(
        `Remaining payment added as client credit: ${remainingPayment}`
      );
    }

    await client.save({ session });

    // Update financial summary
    await FinancialSummary.findOneAndUpdate(
      {},
      { $inc: { totalRevenue: totalPaymentApplied } },
      { session, upsert: true }
    );

    console.log(
      `Financial summary updated: TotalRevenue incremented by ${totalPaymentApplied}`
    );

    // Commit the transaction
    await session.commitTransaction();

    console.log("Partial payment transaction committed successfully.");

    // Revalidate the path
    revalidatePath(path);

    return {
      success: true,
      message: `Partial payment of ${amount} applied successfully.`,
    };
  } catch (error: any) {
    console.error("Error processing partial payment:", error);

    // Abort the transaction in case of an error
    await session.abortTransaction();

    return {
      success: false,
      message: error.message || "Failed to process partial payment.",
    };
  } finally {
    session.endSession();
  }
}
export async function payService({
  serviceId,
  path,
}: {
  serviceId: string;
  path: string;
}) {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      // Find the service by ID and ensure it’s unpaid
      const service = await Service.findOne({
        _id: serviceId,
        paid: false,
      }).session(session);

      if (!service) {
        throw new Error("Service not found or already paid.");
      }

      const remainingAmount = service.remainingAmount || 0;

      if (remainingAmount <= 0) {
        throw new Error("Service has no remaining amount to pay.");
      }

      // Create a new payment record for the remaining amount
      const payment = new Payment({
        clientId: service.clientId,
        amount: remainingAmount,
        serviceId: service._id,
        notes: "Πλήρης πληρωμή για το υπόλοιπο ποσό",
        allocations: [
          {
            serviceId: service._id,
            amount: remainingAmount,
          },
        ], // Record allocation for the payment
      });

      await payment.save({ session });

      // Update the service to mark it as paid
      service.paid = true;
      service.paymentDate = new Date();
      service.paidAmount = (service.paidAmount || 0) + remainingAmount;
      service.remainingAmount = 0;
      service.payments.push(payment._id); // Link payment to the service

      await service.save({ session });

      // Update the client record
      const client = await Client.findByIdAndUpdate(
        service.clientId,
        {
          $pull: { owes: service._id },
          $inc: {
            owesTotal: -remainingAmount,
            totalSpent: remainingAmount,
            points: remainingAmount, // Assuming points are awarded based on payment
          },
        },
        { new: true, session }
      );

      if (!client) {
        throw new Error("Client not found or update failed.");
      }

      // Update the financial summary
      await FinancialSummary.findOneAndUpdate(
        {}, // Assuming a single financial summary document
        { $inc: { totalRevenue: remainingAmount } },
        { upsert: true, session } // Create if it doesn’t exist
      );

      // Log success
      console.log("Service fully paid off:", service);

      // Revalidate the page path
      revalidatePath(path);
    });

    return { success: true, message: "Η υπηρεσία εξοφλήθηκε" };
  } catch (error) {
    console.error("Error in payService:", error);
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
export async function syncOwesTotal(clientId: string) {
  await connectToDatabase();

  try {
    // Fetch all unpaid services for the client
    const unpaidServices = await Service.find({
      clientId,
      paid: false,
    }).select("remainingAmount");

    const totalOwed = unpaidServices.reduce((sum, service) => {
      return sum + (service.remainingAmount || 0);
    }, 0);

    // Update client owesTotal
    await Client.findByIdAndUpdate(clientId, {
      owesTotal: totalOwed,
    });

    return { success: true, totalOwed };
  } catch (error) {
    console.error("Error syncing owesTotal:", error);
    throw new Error("Failed to sync owesTotal");
  }
}
// --------------------------------------income for admin -----------------------------------//
export async function reversePayment({ paymentId, path }: any) {
  connectToDatabase();
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const payment = await Payment.findById(paymentId).session(session);
    if (!payment || payment.reversed) {
      throw new Error("Η πληρωμή δεν βρέθηκε ή έχει ήδη αναιρεθεί.");
    }

    const isAdminPayment = payment.clientId?.toString() === ADMIN;

    if (isAdminPayment) {
      // Delete the service(s) in allocations
      for (const allocation of payment.allocations) {
        await Service.findByIdAndDelete(allocation.serviceId).session(session);
      }

      // Delete the payment itself
      await Payment.deleteOne({ _id: paymentId }).session(session);

      await FinancialSummary.findOneAndUpdate(
        {},
        { $inc: { totalRevenue: -payment.amount } },
        { session }
      );

      await session.commitTransaction();
      revalidatePath(path);

      return {
        success: true,
        message: "Εισροή admin αναιρέθηκε και διαγράφηκε επιτυχώς.",
      };
    }

    // Default logic for non-admin clients
    for (const allocation of payment.allocations) {
      const service = await Service.findById(allocation.serviceId).session(
        session
      );

      if (service) {
        service.paidAmount -= allocation.amount;
        service.remainingAmount += allocation.amount;

        if (service.remainingAmount > 0) {
          service.paid = false;
          service.paymentDate = null;
        }

        await service.save({ session });
      }
    }

    const client = await Client.findById(payment.clientId).session(session);
    if (client) {
      client.owesTotal += payment.amount;

      client.totalSpent -= payment.amount;

      await client.save({ session });
      await syncOwesTotal(client._id.toString());
    }

    await FinancialSummary.findOneAndUpdate(
      {},
      { $inc: { totalRevenue: -payment.amount } },
      { session }
    );

    payment.reversed = true;
    await payment.save({ session });
    revalidatePath(path);

    await session.commitTransaction();

    return { success: true, message: "Η πληρωμή αναιρέθηκε επιτυχώς." };
  } catch (error) {
    await session.abortTransaction();
    console.error("Error reversing payment:", error);
    throw error;
  } finally {
    session.endSession();
  }
}
export async function removeReversedPayment({
  paymentId,
  path,
}: {
  paymentId: string;
  path: string;
}) {
  connectToDatabase();
  try {
    const payment = await Payment.deleteOne({ _id: paymentId });
    if (!payment) {
      throw new Error("Payment not found.");
    }
    revalidatePath(path);
    return { message: "success" };
  } catch (error) {
    console.error("Error removing reversed payments:", error);
    throw error;
  }
}
export async function removePaymentSafely({
  paymentId,
  path,
}: {
  paymentId: string;
  path: string;
}) {
  connectToDatabase();
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const payment = await Payment.findById(paymentId).session(session);
    if (!payment) {
      throw new Error("Payment not found.");
    }

    const isAdminPayment = payment.clientId?.toString() === ADMIN;

    if (isAdminPayment) {
      for (const allocation of payment.allocations) {
        await Service.findByIdAndDelete(allocation.serviceId).session(session);
      }

      await Payment.deleteOne({ _id: paymentId }).session(session);

      await FinancialSummary.findOneAndUpdate(
        {},
        { $inc: { totalRevenue: -payment.amount } },
        { session }
      );

      await session.commitTransaction();
      revalidatePath(path);

      return {
        success: true,
        message: "Η εισροή admin διαγράφηκε επιτυχώς.",
      };
    }

    // Otherwise, reverse and delete
    if (!payment.reversed) {
      for (const allocation of payment.allocations) {
        const service = await Service.findById(allocation.serviceId).session(
          session
        );

        if (service) {
          service.paidAmount -= allocation.amount;
          service.remainingAmount += allocation.amount;

          if (service.remainingAmount > 0) {
            service.paid = false;
            service.paymentDate = null;
          }

          await service.save({ session });
        }
      }

      const client = await Client.findById(payment.clientId).session(session);
      if (client) {
        client.owesTotal += payment.amount;

        client.totalSpent -= payment.amount;

        await client.save({ session });
        await syncOwesTotal(client._id.toString());
      }

      await FinancialSummary.findOneAndUpdate(
        {},
        { $inc: { totalRevenue: -payment.amount } },
        { session }
      );
    }

    await Payment.deleteOne({ _id: paymentId }).session(session);

    await session.commitTransaction();
    revalidatePath(path);

    return {
      success: true,
      message: "Η πληρωμή διαγράφηκε με ασφάλεια.",
    };
  } catch (error) {
    await session.abortTransaction();
    console.error("Error safely removing payment:", error);
    throw error;
  } finally {
    session.endSession();
  }
}

export async function createIncome({
  serviceType,
  notes,
  amount,
  date,
}: {
  serviceType: string;
  notes: string;
  amount: number;
  date: Date;
}) {
  connectToDatabase();
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    console.log(
      "Creating income with service and payment...",
      serviceType,
      amount,
      date
    );

    // 1. Create dummy service (acts as income record)
    const service = await Service.create(
      [
        {
          clientId: ADMIN,
          serviceType,
          date,
          endDate: date,
          totalCost: amount,
          paidAmount: amount,
          remainingAmount: 0,
          paid: true,
          paymentDate: date,
          notes,
        },
      ],
      { session }
    );

    if (!service || service.length === 0) {
      throw new Error("Service creation failed.");
    }

    // 2. Create associated payment with allocation to the service
    const payment = await Payment.create(
      [
        {
          clientId: ADMIN,
          notes,
          amount,
          paymentDate: date,
          allocations: [
            {
              serviceId: service[0]._id,
              amount,
              serviceType,
            },
          ],
        },
      ],
      { session }
    );

    if (!payment || payment.length === 0) {
      throw new Error("Payment creation failed.");
    }

    // 3. Update financial summary
    await FinancialSummary.findOneAndUpdate(
      {},
      { $inc: { totalRevenue: amount } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Income (service + payment) created successfully.",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating income:", error);
    throw error;
  }
}
