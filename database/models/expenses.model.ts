import { Schema, models, model } from "mongoose";
export interface ICategory {
  name: string;
  color?: string;
  icon?: string;
  img?: string;
  parentCategory?: Schema.Types.ObjectId;
  subCategories?: Schema.Types.ObjectId[];
}

export interface IExpense {
  amount: number;
  date: Date;
  category: {
    main: Schema.Types.ObjectId; // Reference to the main category
    sub: Schema.Types.ObjectId; // Reference to the subcategory
  };
  description: string;
}
export const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
  },
  img: {
    type: String,
  },
  icon: {
    type: String,
  },
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    default: null, // Indicates no parent category
  },
  subCategories: [
    {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
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

    description: {
      type: String,
      required: true,
    },
    category: {
      main: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
      sub: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    },
  },
  { timestamps: true }
);
const Expenses = models.Expenses || model<IExpense>("Expenses", ExpenseSchema);
export const Categories =
  models.Categories || model<ICategory>("Categories", CategorySchema);
export default Expenses;
