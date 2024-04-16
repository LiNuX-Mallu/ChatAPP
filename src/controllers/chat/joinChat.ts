import { Request, Response } from "express";
import addMember from "../../services/chat/addMember";

export default async (req: Request, res: Response) => {
    try {
        const {userID} = req;
        const {chatID} = req.body;

        const joined = await addMember(userID, chatID);

        if (joined) {
            res.status(201).end();
        } else {
            throw new Error("Unknown error");
        }
    } catch (error) {
        res.status(500).end();
        console.error(error);
    }
}