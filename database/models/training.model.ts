import { Schema, models, model, Date } from "mongoose";

export interface ITraining {
  name: string;
  clientId: Schema.Types.ObjectId;
  pricePerHour: number;
  date: Date;
  durationHours: number;
  notes: string;
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
    pricePerHour: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    durationHours: {
      type: Number,
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
