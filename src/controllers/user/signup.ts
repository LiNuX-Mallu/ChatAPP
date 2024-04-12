import { Request, Response } from "express";
import register from "../../services/user/register";

export default async (req: Request, res: Response) => {
    try {
        const {
            username,
            pass,
            email,
        } = req.body;

        const registered = await register(username, email, pass);
        if (registered) {
            res.status(200).end();
        } else throw new Error("Something went wrong");
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}