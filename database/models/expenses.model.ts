import { Schema, models, model, Date } from "mongoose";
export interface ICategory {
  name: string;
  color: string;
}
export interface IExpense {
  amount: number;
  date: Date;
  category: ICategory;
  description: string;
}
export const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});
export const ExpenseSchema = new Schema<IExpense>(
  {
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category", // This should match the model name
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Expenses = models.Expenses || model<IExpense>("Expenses", ExpenseSchema);
export const Categories =
  models.Categories || model<ICategory>("Categories", CategorySchema);
export default Expenses;
