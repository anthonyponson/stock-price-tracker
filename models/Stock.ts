import mongoose, { Schema, models } from "mongoose";

const StockSchema = new Schema(
  {
    symbol: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Stock =
  models.Stock ||
  mongoose.model("Stock", StockSchema);

export default Stock;