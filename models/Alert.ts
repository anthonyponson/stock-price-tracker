import mongoose, { Schema, Document } from "mongoose";

export interface IAlert extends Document {
  symbol: string;
  targetPrice: number;
  triggered: boolean;
}

const AlertSchema = new Schema<IAlert>(
  {
    symbol: {
      type: String,
      required: true,
    },
    targetPrice: {
      type: Number,
      required: true,
    },
    triggered: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Alert =
  mongoose.models.Alert ||
  mongoose.model<IAlert>("Alert", AlertSchema);

export default Alert;