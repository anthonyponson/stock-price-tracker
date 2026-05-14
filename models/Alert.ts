import mongoose, { Schema, Document } from "mongoose";

export interface IAlert extends Document {
  symbol: string;
  targetPrice: number;
  condition: "below" | "above";
  triggered: boolean;
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

    condition: {
      type: String,
      enum: ["below", "above"],
      default: "below",
    },

    triggered: {
      type: Boolean,
      default: false,
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