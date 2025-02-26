import { Schema, models, model, Model } from "mongoose";
import FinancialSummary from "./financial.model";

export interface ICategory {
  name: string;
}

export interface IExpense {
  amount: number;
  date: Date;
  category: Schema.Types.ObjectId;
  description: string;
  paymentMethod?: string;
  vendor?: {
    name: string;
    contactInfo?: string;
    serviceType?: string;
  };
  notes?: string;

  taxAmount?: number;
  totalAmount: number;
  status: "pending" | "paid" | "overdue";
}

export const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
});

export const ExpenseSchema = new Schema<IExpense>(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    taxAmount: {
      type: Number,
      default: 24,
      required: true,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: false,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Categories",
      required: true,
    },
    paymentMethod: {
      type: String,
    },
    vendor: {
      name: {
        type: String,

        trim: true,
      },
      clientId: {
        type: Schema.Types.ObjectId,
        ref: "Client",
      },

      contactInfo: {
        type: String,
        trim: true,
      },
      serviceType: {
        type: String,
        trim: true,
      },
    },
    notes: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "overdue"],
      required: true,
    },
  },
  { timestamps: true }
);
/**
 * CREATE HOOK (runs when a new document is saved)
 * Automatically calculates totalAmount (amount + (taxAmount% of amount))
 * Updates financial summary if status is paid
 */

/**
 * UPDATE HOOKS (findOneAndUpdate scenario)
 * In pre, fetch the original doc so you can compare old vs. new.
 * In post, adjust the financial summary based on the changes.
 */
// 1) Pre hook: fetch old doc
ExpenseSchema.pre("save", async function (next) {
  try {
    // If this isn't new, fetch the old doc for comparison
    if (!this.isNew) {
      // Cast `this.constructor` to the correct Mongoose model type
      const ExpenseModel = this.constructor as unknown as Model<IExpense>;
      const oldDoc = await ExpenseModel.findById(this._id);
      (this as any)._originalDoc = oldDoc;
    }

    // If new or amount/tax changed, recalc total
    if (
      this.isNew ||
      this.isModified("amount") ||
      this.isModified("taxAmount")
    ) {
      const tax = this.taxAmount ?? 0;
      this.totalAmount = this.amount * (1 + tax / 100);
    }

    next();
  } catch (err: any) {
    next(err);
  }
});

/**
 * POST-SAVE HOOK
 * - Compare old doc vs new doc for status or totalAmount changes
 * - Update the financial summary accordingly
 */
ExpenseSchema.post("save", async function (doc, next) {
  try {
    const summary = await FinancialSummary.findOne();
    if (!summary) {
      return next();
    }

    const oldDoc = (this as any)._originalDoc;

    // If there's no oldDoc, it's a brand-new expense
    if (!oldDoc) {
      // If new doc is "paid," add to totalExpenses
      if (doc.status === "paid") {
        summary.totalExpenses += doc.totalAmount;
        await summary.save();
      }
      return next();
    }

    // Otherwise, it's an update
    const oldStatus = oldDoc.status;
    const newStatus = doc.status;
    const oldTotal = oldDoc.totalAmount ?? 0;
    const newTotal = doc.totalAmount ?? 0;

    if (oldStatus === "paid" && newStatus !== "paid") {
      // old was paid, new isn't => subtract oldTotal
      summary.totalExpenses -= oldTotal;
    } else if (oldStatus !== "paid" && newStatus === "paid") {
      // old wasn't paid, new is => add newTotal
      summary.totalExpenses += newTotal;
    } else if (oldStatus === "paid" && newStatus === "paid") {
      // stayed "paid" => adjust difference
      summary.totalExpenses += newTotal - oldTotal;
    }

    await summary.save();
    next();
  } catch (err: any) {
    next(err);
  }
});

ExpenseSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next: any) {
    try {
      const docToDelete = this; // doc itself
      if (docToDelete.status === "paid") {
        const summary = await FinancialSummary.findOne();
        if (summary) {
          summary.totalExpenses -= docToDelete.totalAmount || 0;
          await summary.save();
        }
      }
      next();
    } catch (err) {
      next(err);
    }
  }
);

const Expenses = models.Expenses || model<IExpense>("Expenses", ExpenseSchema);
export const Categories =
  models.Categories || model<ICategory>("Categories", CategorySchema);

export default Expenses;
