import { Request, Response } from "express";
import checkLogin from "../../services/user/checkLogin";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const { JWT_SECRET } = process.env;

export default async (req: Request, res: Response) => {
    try {
        const {
            username,
            pass,
        } = req.body;

        const user = await checkLogin(username, pass);
        if (user) {
            const token = await jwt.sign({userID: user.userID}, JWT_SECRET!, {
                expiresIn: '7d',
            });
            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(200).json(user);
        } else {
            res.status(400).json({message: "Incorrect credentials"});
        }
    } catch(error) {
        console.error(error);
        res.status(500).end();
    }
}