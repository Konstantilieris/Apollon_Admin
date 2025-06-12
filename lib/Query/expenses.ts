import Expenses from "@/database/models/expenses.model";
import { ExpensesQuery } from "../actions/expenses.action";
import { connectToDatabase } from "../mongoose";
import FinancialSummary from "@/database/models/financial.model";

export async function getExpenses(params: ExpensesQuery) {
  await connectToDatabase();
  const {
    query,
    status = "all",
    paymentMethod = "all",
    date = "all",
    sort = "date",
    direction = "desc",
  } = params;

  /* coerce paging params – fall back to sane defaults */
  const page = Number(params.page) || 1; // 1‑based
  const limit = Number(params.limit) || 10; // rows per page

  /* ---------------- base $match (cheap fields) ---------------- */
  const match: any = {};
  if (status !== "all") match.status = status;
  if (paymentMethod !== "all") match.paymentMethod = paymentMethod;

  if (date !== "all") {
    const days = Number(date.match(/\d+/)?.[0] ?? 0);
    match.date = { $gte: new Date(Date.now() - days * 86_400_000) };
  }

  /* --------------------- base pipeline ----------------------- */
  const pipeline: any[] = [
    { $match: match },

    /* join category */
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },

    /* join vendor (optional) */
  ];

  /* ------------------- text search filter -------------------- */
  if (query) {
    pipeline.push({
      $match: { "category.name": { $regex: query, $options: "i" } },
    });
  }

  /* ------------------------ sorting -------------------------- */
  const sortMap: Record<string, string> = {
    date: "date",
    totalAmount: "totalAmount",
    amount: "amount",
    taxAmount: "taxAmount",
    category: "category.name",
    vendor: "vendor.name",
  };
  const sortKey = sortMap[sort] ?? "date";
  pipeline.push({ $sort: { [sortKey]: direction === "asc" ? 1 : -1 } });

  /* ---------------------- pagination ------------------------- */
  const skip = (page - 1) * limit;
  pipeline.push({ $skip: skip }, { $limit: limit });

  /* ------------- project to UI‑friendly structure ------------ */
  pipeline.push({
    $project: {
      _id: 1,
      date: 1,
      amount: 1,
      taxAmount: 1,
      totalAmount: 1,
      paymentMethod: 1,
      status: 1,
      notes: 1,
      "category.name": 1,
      "vendor.name": 1,
      "vendor.contactInfo": 1,
      "vendor.serviceType": 1,
    },
  });

  /* ------------------- execute & prepare --------------------- */
  const docs = await Expenses.aggregate(pipeline);
  const data = JSON.parse(JSON.stringify(docs));

  /* total for THIS page only */
  const pageTotal = data.reduce(
    (sum: number, d: { totalAmount?: number }) => sum + (d.totalAmount ?? 0),
    0
  );

  /* total row‑count (all pages) — cheap because it reuses the pre‑$skip pipeline */
  const [{ count = 0 } = {}] = await Expenses.aggregate([
    ...pipeline.slice(
      0,
      pipeline.findIndex((s) => "$skip" in s)
    ),
    { $count: "count" },
  ]);

  return {
    data,
    totalPages: Math.max(1, Math.ceil(count / limit)),
    totalAmount: pageTotal, // sum of the limited rows on the current page
  };
}
export async function getFinancialSummary() {
  await connectToDatabase();
  try {
    const financial = await FinancialSummary.find();
    if (!financial || !financial[0]?.totalExpenses) {
      return 0;
    }
    return JSON.parse(JSON.stringify(financial[0].totalExpenses));
  } catch (error) {}
}
export async function getExpensesTrendSummary(days = 30) {
  await connectToDatabase();

  const now = Date.now();
  const ms = 86_400_000 * days;
  const currStart = new Date(now - ms);
  const prevStart = new Date(now - 2 * ms);
  const total = await getFinancialSummary();
  // helper that returns one number (0 if none)
  const totalBetween = async (from: Date, to?: Date) => {
    const [row = { total: 0 }] = await Expenses.aggregate([
      {
        $match: {
          status: "paid",
          date: { $gte: from, ...(to ? { $lt: to } : {}) },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    return row.total as number;
  };

  const current = await totalBetween(currStart); // last 30 days
  const previous = await totalBetween(prevStart, currStart); // 30–60 days ago
  const deltaPct = previous === 0 ? 0 : ((current - previous) / previous) * 100;

  return { current, previous, deltaPct, total };
}
