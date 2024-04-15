import { Request, Response } from "express";
import findChat from "../../services/chat/findChat";

export default async (req: Request, res: Response) => {
    try {
        const keyword = req.query.keyword;
        if (typeof keyword !== 'string') throw new Error("Query error");
        const chats = await findChat(keyword);
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).end();
        console.error(error);
    }
}