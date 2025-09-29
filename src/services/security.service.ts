 
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

class SecurityService {
    async encryptPassword(password: string) {
        return await bcrypt.hash(password, 10);
    }

    async generateToken(_id: mongoose.Types.ObjectId, email: string, role: string) {
        const secret = process.env.JWT_SECRET || 'secret';
        return await jwt.sign({ _id, email, role }, secret, { expiresIn: '1h' });
    }
    
    async comparePassword(incommingPassword: string, currentPassword: string) {
        return await bcrypt.compare(incommingPassword, currentPassword);
    }

    verifyToken(token: string) {
        try {
            const secret = process.env.JWT_SECRET || 'secret';
            return jwt.verify(token, secret) as { id: string; email: string; role: string };
        } catch (error) {
            return null;
        }
    }
}

export const securityService = new SecurityService();