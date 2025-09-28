import mongoose from 'mongoose';

export type UserRole = 'admin' | 'seller' | 'buyer';

export interface IUser {
    username: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface UserDocument extends IUser, mongoose.Document { }

const UserSchema = new mongoose.Schema<UserDocument>(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['admin', 'seller', 'buyer'], default: 'buyer' },
    },
    {
        timestamps: true,
        collection: 'users'
    },
);

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);