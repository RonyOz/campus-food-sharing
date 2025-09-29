import type { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import type { UserRole } from "../models/user.model";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.header('Authorization');
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    token = token.replace('Bearer ', '');
    const secret = process.env.JWT_SECRET || 'secret';
    const decoded = jwt.verify(token, secret);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(403).json(error);
  }
}

export const authorizeRoles = (allowRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (user && !allowRoles.includes(user.role)) {
      res.status(403).json({ message: `Forbidden, you are a ${user.role} and this service is only available for ${allowRoles}` });
      return;
    }
    next();
  }
}