import mongoose, { Schema, Document } from "mongoose"

export interface AlertDocument extends Document {
  symbol: string
  targetPrice: number
  triggered: boolean
}

const AlertSchema = new Schema<AlertDocument>({
  symbol: { type: String, required: true },
  targetPrice: { type: Number, required: true },
  triggered: { type: Boolean, default: false }
})

export default mongoose.models.Alert ||
  mongoose.model<AlertDocument>("Alert", AlertSchema)