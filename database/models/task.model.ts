import { Schema, models, model } from "mongoose";

export interface ITask {
  title: string;
  description: string;
  status?: string;
  priority: number;
}
const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
    },
    description: { type: String, required: true },
    status: { type: String, default: "Pending" },
    priority: { type: Number, required: true },
  },
  { timestamps: true }
);
const Task = models.Task || model<ITask>("Task", TaskSchema);

export default Task;
