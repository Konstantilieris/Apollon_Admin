import { Schema, models, model } from "mongoose";

interface IConstant {
  type: string;
  value: string[];
}

const ConstantSchema = new Schema<IConstant>(
  {
    type: { type: String, required: true },
    value: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export const Constant =
  models.Constant || model<IConstant>("Constant", ConstantSchema);
