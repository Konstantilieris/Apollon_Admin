import { Schema, model, models } from "mongoose";

export interface IIncome {
  amount: number; // Amount paid
  date: Date; // Payment date
  serviceId?: Schema.Types.ObjectId; // Reference to the associated service (if applicable)
  clientId?: Schema.Types.ObjectId; // Reference to the client
  source?: string; // Description of the source of income
  notes?: string; // Additional information about the payment
}

const IncomeSchema = new Schema<IIncome>(
  {
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service", // Links to a service if this income is tied to a paid service
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client", // Optional reference to a client
    },
    source: {
      type: String, // E.g., "Service Payment", "Subscription", etc.
      required: true,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

const Income = models.Income || model<IIncome>("Income", IncomeSchema);

export default Income;
