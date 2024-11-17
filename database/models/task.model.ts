import { Schema, models, model } from "mongoose";

export interface ITask {
  title: string;
  column?: string;
  id?: string;
}
const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
    },
    column: {
      type: String,
      default: "backlog",
    },
  },
  { timestamps: true }
);
const Task = models.Task || model<ITask>("Task", TaskSchema);

export default Task;
