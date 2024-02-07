import { Schema, models, model } from "mongoose";

export interface IRoom {
  name: string;
  currentBookings?: Schema.Types.ObjectId[];
  price?: number;
}
const RoomSchema = new Schema<IRoom>(
  {
    name: { type: String, required: true, unique: true },
    currentBookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
    price: { type: Number, default: 25 },
  },
  { timestamps: true }
);

const Room = models.Room || model<IRoom>("Room", RoomSchema);

export default Room;
