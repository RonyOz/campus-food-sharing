import mongoose from 'mongoose';

export interface IProduct { // Images...
    name: string;
    sellerId: mongoose.Types.ObjectId; 
    description?: string;
    price: number;
    available: boolean;
}

export interface IProductDocument extends IProduct, mongoose.Document { }

const productSchema = new mongoose.Schema<IProductDocument>({
    name: { type: String, required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String },
    price: { type: Number, required: true },
    available: { type: Boolean, default: true },
}, {
    timestamps: true,
    collection: 'products'
});

export const ProductModel = mongoose.model('Product', productSchema);