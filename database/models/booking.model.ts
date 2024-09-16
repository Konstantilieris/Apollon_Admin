import { Schema, models, model } from "mongoose";
import Service from "./service.model";

export interface IBooking {
  client: {
    clientId: Schema.Types.ObjectId;
    clientName: string;
    transportFee?: number;
    bookingPerDay?: number;
    phone: string;
    location: string;
  };
  fromDate: Date;
  toDate: Date;
  services: Schema.Types.ObjectId[];
  totalAmount: number;

  dogs: Object[];
  flag1: boolean;
  flag2: boolean;
}
const BookingSchema = new Schema<IBooking>(
  {
    client: {
      clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
      clientName: { type: String, required: true },
      phone: { type: String, required: true },
      location: { type: String, required: true },
      transportFee: { type: Number, default: 0 },
      bookingFee: { type: Number, default: 30 },
    },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },

    totalAmount: { type: Number, required: true },
    services: [
      {
        type: Schema.Types.ObjectId,
        ref: "Service", // Link to services related to this booking
      },
    ],
    dogs: [
      {
        dogId: { type: Schema.Types.ObjectId, ref: "Dog", required: true },
        dogName: { type: String, required: true },
        roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
        roomName: { type: String, required: true },
      },
    ],
    flag1: { type: Boolean, default: false, required: true },
    flag2: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);
BookingSchema.pre("save", async function (next) {
  const booking = this;

  // Check for overlapping bookings
  const overlappingBookings = await Booking.find({
    "dogs.dogId": { $in: booking.dogs.map((dog: any) => dog.dogId) },
    $or: [
      { fromDate: { $lt: booking.toDate, $gte: booking.fromDate } },
      { toDate: { $lte: booking.toDate, $gt: booking.fromDate } },
    ],
  });

  if (overlappingBookings.length > 0) {
    return next(new Error("Overlapping bookings for one or more dogs"));
  }

  // Only proceed to calculate the total if there are no errors
  try {
    // Find all services related to this booking
    const services = await Service.find({ bookingId: booking._id });

    // Calculate the total amount for the booking
    booking.totalAmount = services.reduce(
      (sum, service) => sum + service.amount,
      0
    );

    next();
  } catch (error: any) {
    return next(error);
  }
});
const Booking = models.Booking || model<IBooking>("Booking", BookingSchema);

export default Booking;
