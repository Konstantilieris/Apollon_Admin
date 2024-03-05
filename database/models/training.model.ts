import { Schema, models, model, Date } from "mongoose";

export interface ITraining {
  name: string;
  clientId: Schema.Types.ObjectId;
  price: number;
  date: Date;
  dogs: Object[];
  notes: string;
  timeArrival: string;
  timeDeparture: string;
}
const TrainingSchema = new Schema<ITraining>(
  {
    name: {
      type: String,
      required: true,
    },
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
    timeArrival: { type: String, required: true },
    timeDeparture: { type: String, required: true },
    price: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },

    notes: {
      type: String,
    },
  },
  { timestamps: true }
);
const Training =
  models.Training || model<ITraining>("Training", TrainingSchema);

export default Training;
