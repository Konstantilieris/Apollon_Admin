import { Schema, models, model, Date } from "mongoose";

export interface ITransport {
  clientId: Schema.Types.ObjectId;
  price: number;
  date: Date;
  dogs: Object[];
  notes: string;
  timeArrival: string;
}

const TransportSchema = new Schema<ITransport>(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    dogs: [
      {
        dogId: { type: Schema.Types.ObjectId, ref: "Dog", required: true },
        dogName: { type: String, required: true },
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeArrival: { type: String, required: true },

    notes: {
      type: String,
    },
  },
  { timestamps: true }
);
const Transport =
  models.Transport || model<ITransport>("Transport", TransportSchema);

export default Transport;
