import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const {JWT_SECRET} = process.env;

declare module 'express-serve-static-core' {
    interface Request {
        userID: string;
    }
}

export default async (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.cookies.token;
    try {
        const decoded = jwt.verify(token, JWT_SECRET!) as {userID: string} | string;
        if (typeof decoded === 'string') {
            throw new Error('Invalid or expired token');
        } else if (typeof decoded === 'object' && 'userID' in decoded) {
            req.userID = decoded.userID;
            next();
        } else {
            throw new Error('Invalid or expired token');
        }
    } catch(error) {
        res.status(401).json({message: "Invalid or expired token"});
    }
};