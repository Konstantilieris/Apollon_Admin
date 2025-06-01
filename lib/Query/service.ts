import Service from "@/database/models/service.model";
import { GetServicesFilters, PagedServices } from "../actions/service.action";
import { connectToDatabase } from "../mongoose";
import { endOfWeek, startOfWeek } from "date-fns";

export async function getAllServices(
  filters: GetServicesFilters
): Promise<PagedServices> {
  await connectToDatabase();

  const { paid, from, to, sortDir = "desc", page = 1, limit = 10 } = filters;

  // build Mongo match stage
  const matchStage: any = {};
  if (typeof paid === "boolean") matchStage.paid = paid;
  if (from || to) {
    matchStage.date = {};
    if (from) matchStage.date.$gte = new Date(from);
    if (to) matchStage.date.$lte = new Date(to);
  }

  const pipeline: any[] = [
    { $match: matchStage },
    {
      $lookup: {
        from: "clients",
        localField: "clientId",
        foreignField: "_id",
        as: "client",
      },
    },
    { $unwind: { path: "$client", preserveNullAndEmptyArrays: true } },

    ...(filters.query
      ? [
          {
            $match: {
              "client.name": { $regex: filters.query, $options: "i" },
            },
          },
        ]
      : []),

    {
      $facet: {
        rows: [
          { $sort: { date: sortDir === "asc" ? 1 : -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              serviceType: 1,
              date: 1,
              endDate: 1,
              amount: 1,
              taxAmount: 1,
              totalAmount: 1,
              paidAmount: 1,
              remainingAmount: 1,
              client: { name: 1, _id: 1 },
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ];
  const result = await Service.aggregate(pipeline);

  const rows = result[0].rows.map((s: any) => ({
    _id: s._id.toString(),
    serviceType: s.serviceType,
    date: s.date,
    endDate: s.endDate,
    amount: s.amount,
    taxAmount: s.taxAmount,
    totalAmount: s.totalAmount,
    paidAmount: s.paidAmount,
    remainingAmount: s.remainingAmount,
    client: {
      id: s.client?._id.toString() || null,
      name: s.client?.name || "",
    },
  }));

  const totalCount = result[0].totalCount[0]?.count || 0;

  return { rows, totalCount };
}

export async function getTopServiceThisWeek(): Promise<{
  name: string;
  totalAmount: number;
  date: string;
} | null> {
  await connectToDatabase();

  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(now, { weekStartsOn: 1 }); // Sunday

  const result = await Service.aggregate([
    {
      $match: {
        date: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: "$serviceType",
        totalAmount: { $sum: "$totalAmount" },
        latestDate: { $max: "$date" },
      },
    },
    { $sort: { totalAmount: -1 } },
    { $limit: 1 },
    {
      $project: {
        name: "$_id",
        totalAmount: 1,
        date: "$latestDate",
        _id: 0,
      },
    },
  ]);

  return result[0] || null;
}
export async function getWeeklyServiceBreakdown(days = 7) {
  await connectToDatabase();

  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - days + 1);

  const services = await Service.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: now },
      },
    },
    {
      $addFields: {
        weekday: {
          $dayOfWeek: "$date", // 1 = Sunday, 7 = Saturday
        },
      },
    },
    {
      $group: {
        _id: {
          weekday: "$weekday",
          serviceType: "$serviceType",
        },
        total: { $sum: "$totalAmount" },
      },
    },
  ]);

  // Map weekday number to string
  const weekdayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const weekdayData: Record<string, Record<string, number>> = {};

  services.forEach((s) => {
    const day = weekdayMap[(s._id.weekday + 6) % 7]; // Make Monday = 0
    const serviceType = s._id.serviceType;

    if (!weekdayData[day]) {
      weekdayData[day] = {};
    }

    weekdayData[day][serviceType] = s.total;
  });

  // Ensure all days are filled
  const daysOrdered = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const categories = Array.from(
    new Set(services.map((s) => s._id.serviceType))
  );

  const chartData = daysOrdered.map((day) => {
    const entry: Record<string, any> = { weekday: day };
    categories.forEach((cat) => {
      entry[cat.toLowerCase()] = weekdayData[day]?.[cat] || 0;
    });
    return entry;
  });

  return {
    chartData,
    categories,
  };
}

export async function getTotalOutstandingEver(): Promise<number> {
  await connectToDatabase();

  const result = await Service.aggregate([
    {
      $match: {
        remainingAmount: { $gt: 0 },
      },
    },
    {
      $group: {
        _id: null,
        totalOutstanding: { $sum: "$remainingAmount" },
      },
    },
  ]);

  return result[0]?.totalOutstanding || 0;
}
export async function getRemainingAmountForCurrentMonth(): Promise<number> {
  await connectToDatabase();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const result = await Service.aggregate([
    {
      $match: {
        date: { $gte: startOfMonth, $lte: endOfMonth },
        remainingAmount: { $gt: 0 },
      },
    },
    {
      $group: {
        _id: null,
        totalRemaining: { $sum: "$remainingAmount" },
      },
    },
  ]);

  return result[0]?.totalRemaining || 0;
}
export async function getServiceDistributionThisMonth() {
  await connectToDatabase();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const result = await Service.aggregate([
    {
      $match: {
        date: { $gte: startOfMonth },
      },
    },
    {
      $group: {
        _id: "$serviceType",
        totalAmount: { $sum: "$totalAmount" },
      },
    },
    {
      $project: {
        name: "$_id",
        value: "$totalAmount",
        _id: 0,
      },
    },
  ]);

  const categories = result.map((item) => item.name);

  return {
    chartData: result,
    categories,
  };
}
export async function getOverdueServicesFromLastMonth() {
  await connectToDatabase();

  const now = new Date();
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0); // last day of previous month

  const result = await Service.aggregate([
    // 1️⃣ still limit to last-month records with an open balance
    {
      $match: {
        date: { $gte: startOfLastMonth, $lte: endOfLastMonth },
        remainingAmount: { $gt: 0 },
      },
    },
    // 2️⃣ work out how many days have passed
    {
      $addFields: {
        daysOverdue: {
          $dateDiff: {
            startDate: "$date",
            endDate: "$$NOW",
            unit: "day",
          },
        },
      },
    },
    // 3️⃣ keep only “red debt” (≥ 30-day gap)
    { $match: { daysOverdue: { $gte: 30 } } },

    {
      $lookup: {
        from: "clients",
        localField: "clientId",
        foreignField: "_id",
        as: "client",
      },
    },
    { $unwind: { path: "$client", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        serviceType: 1,
        date: 1,
        totalAmount: 1,
        remainingAmount: 1,
        daysOverdue: 1, // <-- handy in the UI
        client: { _id: 1, name: 1 },
      },
    },
    { $sort: { remainingAmount: -1 } },
  ]);

  return result.map((s) => ({
    id: s._id.toString(),
    serviceType: s.serviceType,
    date: s.date,
    totalAmount: s.totalAmount,
    remainingAmount: s.remainingAmount,
    daysOverdue: s.daysOverdue,
    client: {
      id: s.client?._id.toString() || null,
      name: s.client?.name || "",
    },
  }));
}
