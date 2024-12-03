import { Schema, models, model } from "mongoose";

export interface IService {
  serviceType: string;
  amount: number;
  clientId: Schema.Types.ObjectId;
  date: Date;
  paid: boolean;
  bookingId?: Schema.Types.ObjectId;
  paymentDate?: Date;
  endDate?: Date;
  notes?: string;
  paidAmount?: number;
  remainingAmount?: number;
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
  paidAmount: {
    type: Number,
    default: 0, // Starts with 0, increases as payments are made
  },
  remainingAmount: {
    type: Number,
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
  if (this.isNew && !this.remainingAmount && !this.paid) {
    this.remainingAmount = this.amount; // Set remainingAmount to the initial amount on document creation
  }
  next();
});
const Service = models.Service || model<IService>("Service", ServiceSchema);
export default Service;
