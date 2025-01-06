import { Schema, models, model } from "mongoose";

export interface IPayment extends Document {
  serviceId?: Schema.Types.ObjectId;
  clientId: Schema.Types.ObjectId;
  amount: number;
  date: Date;
  notes?: string;
  reversed?: boolean;
  allocations?: {
    serviceId: Schema.Types.ObjectId;
    amount: number;
  }[];
  // Whether the payment is reversed or refunded
}
const PaymentSchema = new Schema<IPayment>({
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: "Service",
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0, // Prevent negative payments
  },
  date: {
    type: Date,
    default: Date.now, // Default to the current date
  },

  notes: {
    type: String, // Optional notes about the payment
  },
  reversed: {
    type: Boolean,
    default: false, // Defaults to not reversed
  },
  allocations: {
    type: [
      {
        serviceId: {
          type: Schema.Types.ObjectId,
          ref: "Service",
          required: true,
        },
        amount: {
          type: Number,
          required: true, // Amount applied to the specific service
        },
      },
    ],
    default: [],
  },
});

const Payment = models.Payment || model<IPayment>("Payment", PaymentSchema);
export default Payment;
