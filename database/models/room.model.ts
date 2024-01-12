import { Schema, models, model, Date } from "mongoose";

export interface IRoom {
  name: string;
  currentBookings?: Schema.Types.ObjectId[];
  price?: number;
  unavailableDates?: Date[];
}
const RoomSchema = new Schema<IRoom>(
  {
    name: { type: String, required: true, unique: true },
    currentBookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
    price: { type: Number, default: 25 },
    unavailableDates: [{ type: String }],
  },
  { timestamps: true }
);

const Room = models.Room || model<IRoom>("Room", RoomSchema);

export default Room;
