import { Schema, models, model } from "mongoose";

export interface IService {
  serviceType: string;
  amount: number;
  clientId: Schema.Types.ObjectId;
  date: Date;
  paid: boolean;
  bookingId?: Schema.Types.ObjectId;
  paymentDate?: Date | null;
  endDate?: Date;
  notes?: string;
  paidAmount?: number;
  remainingAmount?: number;
  payments?: Schema.Types.ObjectId[];
  discount?: number;
}

const ServiceSchema = new Schema<IService>({
  serviceType: {
    type: String,
    required: true,
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: "Booking",
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  discount: {
    type: Number,
    default: 0, // No discount by default
  },
  endDate: {
    type: Date,
  },
  paidAmount: {
    type: Number,
    default: 0, // Starts with 0, increases as payments are made
  },
  payments: {
    type: [Schema.Types.ObjectId],
    ref: "Payment",
    default: [],
  },
  remainingAmount: {
    type: Number,
    default: function (this: IService) {
      return this.amount; // Default to full amount
    },
  },
  paid: {
    type: Boolean,
    default: false,
  },
  paymentDate: {
    type: Date,
  },
});
ServiceSchema.pre("save", function (next) {
  // Ensure remainingAmount is calculated correctly
  const adjustedAmount = Math.max(this.amount - (this.discount ?? 0), 0);
  this.remainingAmount = Math.max(adjustedAmount - (this.paidAmount ?? 0), 0);
  // Mark as paid if fully paid
  this.paid = this.remainingAmount === 0;

  // Set paymentDate if fully paid
  if (this.paid && !this.paymentDate) {
    this.paymentDate = new Date();
  } else if (!this.paid) {
    this.paymentDate = null; // Reset paymentDate if not fully paid
  }

  next();
});

// Ensure paidAmount does not exceed total amount
ServiceSchema.pre("validate", function (next) {
  if ((this.paidAmount ?? 0) > (this.amount ?? 0)) {
    return next(new Error("Paid amount cannot exceed the total amount."));
  }
  next();
});

const Service = models.Service || model<IService>("Service", ServiceSchema);
export default Service;
