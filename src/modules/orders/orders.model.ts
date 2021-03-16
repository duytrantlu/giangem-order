import { Schema, Document } from "mongoose";
import { ORDER_CURRENCY, ORDER_STATUS} from "./enum/orders.enum";

export const OrderSchema = new Schema({
  customer: {
    type: String,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: ORDER_CURRENCY.USD,
    enum: Object.values(ORDER_CURRENCY)
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentId: {
    type: String
  },
  deleted: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(ORDER_STATUS),
    default: ORDER_STATUS.CREATED
  }
}, {
  timestamps: {
    createdAt: "createdDate",
    updatedAt: "updatedDate"
  }
});

export interface IOrder extends Document {
  readonly _id: string;
  readonly customer: string;
  readonly productName: string;
  readonly price: number;
  readonly quantity: number;
  readonly totalAmount: number;
  currency: string;
  status: string;
  paymentId?: string;
}