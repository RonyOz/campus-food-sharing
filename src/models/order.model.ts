import mongoose from "mongoose";

export type OrderStatus = 'pending' | 'accepted' | 'delivered' | 'canceled';

export interface IOrder {
    buyerId: mongoose.Types.ObjectId;
    items: {
        productId: mongoose.Types.ObjectId;
        quantity: number;
    }[];
    status: OrderStatus;
}

export interface IOrderDocument extends IOrder, mongoose.Document { }

const OrderSchema = new mongoose.Schema<IOrderDocument>(
    {
        buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        items: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true, min: 1 },
            }
        ],
        status: { type: String, enum: ['pending', 'accepted', 'delivered', 'canceled'], default: "pending" },
    },
    {
        timestamps: true,
        collection: 'orders'
    }
);

export const OrderModel = mongoose.model<IOrderDocument>('Order', OrderSchema);