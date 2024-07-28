import { Schema, models, model } from "mongoose";

export interface IRoom {
  name: string;
}
const RoomSchema = new Schema<IRoom>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Room = models.Room || model<IRoom>("Room", RoomSchema);

export default Room;
