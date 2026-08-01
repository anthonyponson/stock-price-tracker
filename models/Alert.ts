import mongoose, { Schema, Document } from "mongoose";

export interface IAlert extends Document {
  symbol: string;
  targetPrice: number;
  currentPrice?: number;
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

    currentPrice: {
      type: Number,
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