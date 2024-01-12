import { Schema, models, model, Model, Document } from "mongoose";
import bcrypt from "bcrypt";

interface IAdmin extends Document {
  name: string;
  password: string;
  role: "user" | "admin";
}

interface Methods {
  comparePassword(password: string): Promise<boolean>;
}

const adminSchema = new Schema<IAdmin, {}, Methods>({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // eslint-disable-next-line no-useless-catch
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

adminSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

const AdminModel = models.Admin || model("Admin", adminSchema);

export default AdminModel as Model<IAdmin, {}, Methods>;
