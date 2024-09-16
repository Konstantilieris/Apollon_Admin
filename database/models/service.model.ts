import { Schema, models, model } from "mongoose";
import Client from "./client.model"; // Assuming this is the correct path to your Client model

export interface IService {
  serviceType: string;
  amount: number;
  clientId: Schema.Types.ObjectId;
  date: Date;
  paid: boolean;
  bookingId?: Schema.Types.ObjectId;
  paymentDate?: Date;
  notes?: string;
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
  paid: {
    type: Boolean,
    default: false,
  },
  paymentDate: {
    type: Date,
  },
});

// Combined `pre('save')` hook for updating client data
ServiceSchema.pre("save", async function (next) {
  const service = this;

  try {
    // Check if the service is paid and if it's a new payment
    if (service.isModified("paid") && service.paid) {
      if (!service.paymentDate) {
        service.paymentDate = new Date();
      }

      // Add a point to the client's account and push payment info to the client's paymentHistory
      await Client.findByIdAndUpdate(
        service.clientId,
        {
          $inc: { points: service.amount, totalSpent: service.amount },
          $addToSet: { servicePreferences: service.serviceType }, // Add the service type to preferences if not already present
        },
        { new: true }
      );
    }

    // If the payment is reversed, remove it from paymentHistory and adjust the points and totalSpent
    if (service.isModified("paid") && !service.paid) {
      await Client.findByIdAndUpdate(
        service.clientId,
        {
          $inc: { points: -service.amount, totalSpent: -service.amount },
        },
        { new: true }
      );
    }

    next();
  } catch (error: any) {
    return next(error);
  }
});

// `post('save')` hook for updating lastActivity
ServiceSchema.post("save", async function (doc, next) {
  try {
    // Update lastActivity when a service is created or updated
    await Client.findByIdAndUpdate(
      doc.clientId,
      { lastActivity: new Date() } // Set lastActivity to the current date
    );
    next();
  } catch (error: any) {
    return next(error);
  }
});

const Service = models.Service || model<IService>("Service", ServiceSchema);
export default Service;
