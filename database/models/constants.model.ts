import { Schema, models, model } from "mongoose";

interface IConstant {
  type: string;
  value: string[];
}

const ConstantSchema = new Schema<IConstant>({
  type: { type: String, required: true },
  value: [{ type: String, unique: true, required: true }],
});

const Constant =
  models.Constant || model<IConstant>("Constant", ConstantSchema);
export default Constant;
