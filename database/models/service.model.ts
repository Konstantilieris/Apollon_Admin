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
  taxRate?: number; // Added taxRate (percentage)
  taxAmount?: number; // Calculated tax amount
  totalAmount?: number; // Total amount including tax
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
    default: 0,
  },
  endDate: {
    type: Date,
  },
  paidAmount: {
    type: Number,
    default: 0,
  },
  payments: {
    type: [Schema.Types.ObjectId],
    ref: "Payment",
    default: [],
  },
  taxRate: {
    type: Number,
    default: 0,
  },
  taxAmount: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
  remainingAmount: {
    type: Number,
    default: 0,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  paymentDate: {
    type: Date,
  },
});

// Middleware to update tax, totalAmount, and remainingAmount before saving
ServiceSchema.pre("save", function (next) {
  // Calculate tax and total amount
  this.taxAmount = (this.amount * (this.taxRate ?? 0)) / 100;
  this.totalAmount = this.amount + this.taxAmount;

  // Ensure remainingAmount is calculated correctly
  const adjustedAmount = Math.max(this.totalAmount - (this.discount ?? 0), 0);
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

// If using findOneAndUpdate anywhere, this runs:
ServiceSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as Partial<IService>;

  if (
    update.amount !== undefined ||
    update.taxRate !== undefined ||
    update.discount !== undefined ||
    update.paidAmount !== undefined
  ) {
    update.taxAmount = (update.amount! * (update.taxRate ?? 0)) / 100;
    update.totalAmount = Math.max(
      update.amount! + update.taxAmount - (update.discount ?? 0),
      0
    );
    update.remainingAmount = Math.max(
      update.totalAmount - (update.paidAmount ?? 0),
      0
    );
    update.paid = update.remainingAmount === 0;
    update.paymentDate = update.paid ? new Date() : null;
  }

  this.setUpdate(update);
  next();
});

// Ensure paidAmount does not exceed totalAmount
ServiceSchema.pre("validate", function (next) {
  if ((this.paidAmount ?? 0) > (this.totalAmount ?? 0)) {
    return next(
      new Error("Paid amount cannot exceed the total amount (including tax).")
    );
  }
  next();
});

const Service = models.Service || model<IService>("Service", ServiceSchema);
export default Service;
