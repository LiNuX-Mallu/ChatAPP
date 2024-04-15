import { Request, Response } from "express";
import chatData from "../../services/chat/chatData";

export default async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const chat = await chatData(id);
        if (chat) {
            res.status(200).json(chat);
        }
    } catch (error) {
        res.status(500).end();
        console.error(error);
    }
}