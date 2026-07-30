import mongoose, { Schema, Document } from "mongoose";

export interface IAlert extends Document {
  symbol: string;
  targetPrice: number;
  currentPrice?: number;
  lastTriggeredAt?: Date;
  triggered: boolean;
}

const AlertSchema = new Schema<IAlert>(
  {
    symbol: {
      type: String,
      required: true,
    },
    triggered: {
      type: Boolean,
      default: false,
    },

    targetPrice: {
      type: Number,
      required: true,
    },

    lastTriggeredAt: {
      type: Date,
      default: null,
    },

    currentPrice: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

const Alert =
  mongoose.models.Alert || mongoose.model<IAlert>("Alert", AlertSchema);

export default Alert;
