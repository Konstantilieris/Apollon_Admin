import { Schema, models, model } from "mongoose";

export interface IFinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
}

const FinancialSummarySchema = new Schema<IFinancialSummary>(
  {
    totalRevenue: {
      type: Number,
      required: true,
      default: 0, // Starts at 0 and gets updated as transactions occur
    },
    totalExpenses: {
      type: Number,
      required: true,
      default: 0, // Starts at 0 and gets updated as transactions occur
    },
  },
  { timestamps: true } // Keeps track of updates
);

const FinancialSummary =
  models.FinancialSummary ||
  model<IFinancialSummary>("FinancialSummary", FinancialSummarySchema);

export default FinancialSummary;
