import { Schema, models, model } from "mongoose";

export interface IBooking {
  clientId: Schema.Types.ObjectId;
  fromDate: Date;
  toDate: Date;

  totalAmount: number;

  dogs: Object[];
  flag1: boolean;
  flag2: boolean;
}
const BookingSchema = new Schema<IBooking>(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },

    totalAmount: { type: Number, required: true },

    dogs: [
      {
        dogId: { type: Schema.Types.ObjectId, ref: "Dog", required: true },
        dogName: { type: String, required: true },
        roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
      },
    ],
    flag1: { type: Boolean, default: false, required: true },
    flag2: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);

const Booking = models.Booking || model<IBooking>("Booking", BookingSchema);

export default Booking;
