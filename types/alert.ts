export interface AlertType {
  _id?: string;
  symbol: string;
  targetPrice: number;
  condition: "below" | "above";
  triggered: boolean;
  currentPrice?: number;
}