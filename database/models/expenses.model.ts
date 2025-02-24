import { Schema, models, model } from "mongoose";
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
ExpenseSchema.pre("save", async function (next) {
  // If this is a new expense
  if (this.isNew) {
    // Calculate totalAmount
    if (this.amount !== undefined && this.taxAmount !== undefined) {
      this.totalAmount = this.amount * (1 + this.taxAmount / 100);
    }
    // If paid, update financial summary
    if (this.status === "paid") {
      const summary = await FinancialSummary.findOne();
      if (summary) {
        summary.totalExpenses += this.totalAmount;
        await summary.save();
      }
    }
  }
  next();
});

/**
 * UPDATE HOOKS (findOneAndUpdate scenario)
 * In pre, fetch the original doc so you can compare old vs. new.
 * In post, adjust the financial summary based on the changes.
 */
// 1) Pre hook: fetch old doc
ExpenseSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const docToUpdate = await this.model.findOne(this.getQuery());
    (this as any)._originalDoc = docToUpdate || null;

    const update = this.getUpdate();

    // 1. Check if it's an array (which would mean aggregation pipeline)
    if (Array.isArray(update)) {
      // It's a pipeline. You can't directly set $set on an aggregation pipeline.
      // If needed, handle pipeline logic here or skip setting $set.
      return next();
    }

    // 2. Otherwise, it's an UpdateQuery object, so we can safely use $set
    if (!update) {
      return next(new Error("Update object is null"));
    }
    const newAmount = update.$set?.amount;
    const newTaxAmount = update.$set?.taxAmount;

    if (typeof newAmount === "number" || typeof newTaxAmount === "number") {
      const finalAmount =
        typeof newAmount === "number" ? newAmount : docToUpdate?.amount || 0;
      const finalTax =
        typeof newTaxAmount === "number"
          ? newTaxAmount
          : docToUpdate?.taxAmount || 0;

      // Ensure $set exists before adding to it
      if (!update.$set) {
        update.$set = {};
      }
      update.$set.totalAmount = finalAmount * (1 + finalTax / 100);
    }

    next();
  } catch (err: any) {
    next(err);
  }
});

// 2) Post hook: compare old doc vs. new doc
ExpenseSchema.post("findOneAndUpdate", async function (doc, next) {
  try {
    const originalDoc = (this as any)._originalDoc;
    // `doc` here is the *updated* document after changes

    if (!originalDoc || !doc) {
      return next();
    }

    // If the doc's status changed from paid to something else, subtract from summary
    // If changed from something else to paid, add to summary
    // If the amount/tax changed while still in paid status, adjust the difference, etc.

    const oldStatus = originalDoc.status;
    const newStatus = doc.status;

    const oldTotal = originalDoc.totalAmount || 0;
    const newTotal = doc.totalAmount || 0;

    // 1) If old was paid and new is NOT paid => subtract oldTotal
    // 2) If new is paid and old was NOT paid => add newTotal
    // 3) If both old and new are paid => adjust difference
    const summary = await FinancialSummary.findOne();
    if (!summary) {
      return next();
    }

    if (oldStatus === "paid" && newStatus !== "paid") {
      summary.totalExpenses -= oldTotal;
    } else if (oldStatus !== "paid" && newStatus === "paid") {
      summary.totalExpenses += newTotal;
    } else if (oldStatus === "paid" && newStatus === "paid") {
      // If it stayed in paid, see if the total changed
      const difference = newTotal - oldTotal;
      summary.totalExpenses += difference;
    }

    await summary.save();
    next();
  } catch (err: any) {
    next(err);
  }
});

/**
 * DELETE HOOK (findOneAndDelete scenario)
 * Subtract the amount from the summary if it was paid
 */
ExpenseSchema.pre("findOneAndDelete", async function (next) {
  try {
    // The doc to be deleted
    const docToDelete = await this.model.findOne(this.getQuery());
    if (!docToDelete) {
      return next();
    }

    // If the doc was paid, subtract from summary
    if (docToDelete.status === "paid") {
      const summary = await FinancialSummary.findOne();
      if (summary) {
        summary.totalExpenses -= docToDelete.totalAmount || 0;
        await summary.save();
      }
    }
    next();
  } catch (err: any) {
    next(err);
  }
});

const Expenses = models.Expenses || model<IExpense>("Expenses", ExpenseSchema);
export const Categories =
  models.Categories || model<ICategory>("Categories", CategorySchema);

export default Expenses;
