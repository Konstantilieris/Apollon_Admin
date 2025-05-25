import Payment from "@/database/models/payment.model";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfWeek,
  endOfWeek,
  subWeeks,
  startOfYear,
  subYears,
} from "date-fns";
import { connectToDatabase } from "../mongoose";
import { GetPaymentsFilters, PagedPayments } from "../actions/payment.action";
import FinancialSummary from "@/database/models/financial.model";

export type RevenueTrend = {
  value: number;
  change: string;
  changeType: "positive" | "neutral" | "negative";
  trendType: "up" | "neutral" | "down";
};

/** Month-to-date revenue vs. previous calendar month */
export async function getMonthlyRevenueTrend(): Promise<RevenueTrend> {
  await connectToDatabase();

  const today = new Date();
  const curStart = startOfMonth(today);
  const curEnd = today; // inclusive “-to-date”
  const prevStart = subMonths(curStart, 1);
  const prevEnd = endOfMonth(prevStart);

  const [currentAgg, previousAgg] = await Promise.all([
    Payment.aggregate([
      {
        $match: {
          reversed: { $ne: true },
          date: { $gte: curStart, $lte: curEnd },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Payment.aggregate([
      {
        $match: {
          reversed: { $ne: true },
          date: { $gte: prevStart, $lte: prevEnd },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  const totalCurrent = currentAgg[0]?.total ?? 0;
  const totalPrevious = previousAgg[0]?.total ?? 0;

  const delta = totalCurrent - totalPrevious;
  const pctRaw = totalPrevious ? (delta / totalPrevious) * 100 : 0;
  const pctFormatted = `${Math.abs(pctRaw).toFixed(0)}%`;

  const changeType =
    delta > 0 ? "positive" : delta < 0 ? "negative" : "neutral";

  const trendType = delta > 0 ? "up" : delta < 0 ? "down" : "neutral";

  return {
    value: totalCurrent,
    change: pctFormatted,
    changeType,
    trendType,
  };
}
export async function getWeeklyRevenue() {
  await connectToDatabase();

  const today = new Date();

  const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const endOfThisWeek = endOfWeek(today, { weekStartsOn: 1 });

  const startOfLastWeek = subWeeks(startOfThisWeek, 1);
  const endOfLastWeek = subWeeks(endOfThisWeek, 1);

  const [thisWeekPayments, lastWeekPayments] = await Promise.all([
    Payment.find({
      date: { $gte: startOfThisWeek, $lte: endOfThisWeek },
    }),
    Payment.find({
      date: { $gte: startOfLastWeek, $lte: endOfLastWeek },
    }),
  ]);

  const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const getDailyTotals = (payments: any[]) => {
    const totals: Record<string, number> = {
      Mo: 0,
      Tu: 0,
      We: 0,
      Th: 0,
      Fr: 0,
      Sa: 0,
      Su: 0,
    };

    for (const payment of payments) {
      const day = new Intl.DateTimeFormat("en-US", {
        weekday: "short",
      })
        .format(new Date(payment.date))
        .slice(0, 2);

      const dayKey = weekdays.find((d) => d.startsWith(day)) ?? "Mo";
      totals[dayKey] += payment.amount;
    }

    return totals;
  };

  const thisWeek = getDailyTotals(thisWeekPayments);
  const lastWeek = getDailyTotals(lastWeekPayments);

  const totalThisWeek = Object.values(thisWeek).reduce((a, b) => a + b, 0);
  const totalLastWeek = Object.values(lastWeek).reduce((a, b) => a + b, 0);

  const percentChange = totalLastWeek
    ? (((totalThisWeek - totalLastWeek) / totalLastWeek) * 100).toFixed(0) + "%"
    : "0%";

  return { thisWeek, lastWeek, percentChange };
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
    page = 1,
    limit = 10,
  } = filters;

  const matchStage: any = {};
  if (typeof reversed === "boolean") matchStage.reversed = reversed;
  if (from || to) {
    matchStage.date = {};
    if (from) matchStage.date.$gte = new Date(from);
    if (to) matchStage.date.$lte = new Date(to);
  }

  const pipeline: any[] = [
    { $match: matchStage },

    // Join with Client
    {
      $lookup: {
        from: "clients",
        localField: "clientId",
        foreignField: "_id",
        as: "client",
      },
    },
    { $unwind: { path: "$client", preserveNullAndEmptyArrays: true } },

    // Filter by clientName if provided
    ...(clientName
      ? [
          {
            $match: {
              "client.name": { $regex: new RegExp(clientName, "i") },
            },
          },
        ]
      : []),

    // Join with Service
    {
      $lookup: {
        from: "services",
        localField: "serviceId",
        foreignField: "_id",
        as: "service",
      },
    },
    { $unwind: { path: "$service", preserveNullAndEmptyArrays: true } },

    // Join allocations -> service
    {
      $lookup: {
        from: "services",
        localField: "allocations.serviceId",
        foreignField: "_id",
        as: "allocationServices",
      },
    },

    // Pagination and count
    {
      $facet: {
        rows: [
          { $sort: { date: sortDir === "asc" ? 1 : -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ];

  const result = await Payment.aggregate(pipeline);

  const rows = result[0].rows.map((p: any) => ({
    id: p._id.toString(),
    date: p.date,
    clientName: p.client?.name ?? "",
    clientId: p.clientId.toString(),
    service: p.service
      ? {
          id: p.service._id.toString(),
          serviceType: p.service.serviceType,
          date: p.service.date,
          endDate: p.service.endDate,
        }
      : undefined,
    amount: p.amount,
    notes: p.notes,
    reversed: p.reversed,
    allocations: (p.allocations || []).map((alloc: any) => {
      const matchedService = (p.allocationServices || []).find(
        (s: any) => s._id.toString() === alloc.serviceId.toString()
      );
      return {
        id: alloc.serviceId.toString(),
        serviceType: matchedService?.serviceType || "",
        amount: alloc.amount,
      };
    }),
  }));

  const totalCount = result[0].totalCount[0]?.count || 0;

  return { rows, totalCount };
}
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
export async function getYearlyRevenueTrend(): Promise<RevenueTrend> {
  await connectToDatabase();

  const today = new Date();
  const curStart = startOfYear(today);
  const curEnd = today; // YTD
  const prevStart = subYears(curStart, 1); // Jan-01 last year
  const prevEnd = subYears(today, 1); // same day last year

  const [curAgg, prevAgg] = await Promise.all([
    Payment.aggregate([
      {
        $match: {
          reversed: { $ne: true },
          date: { $gte: curStart, $lte: curEnd },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Payment.aggregate([
      {
        $match: {
          reversed: { $ne: true },
          date: { $gte: prevStart, $lte: prevEnd },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  const current = curAgg[0]?.total ?? 0;
  const previous = prevAgg[0]?.total ?? 0;
  const delta = current - previous;
  const pctRaw = previous ? (delta / previous) * 100 : 0;

  return {
    value: current,
    change: `${Math.abs(pctRaw).toFixed(0)}%`,
    changeType: delta > 0 ? "positive" : delta < 0 ? "negative" : "neutral",
    trendType: delta > 0 ? "up" : delta < 0 ? "down" : "neutral",
  };
}
