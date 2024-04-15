import { Request, Response } from "express";
import getChats from "../../services/chat/getChats";

export default async (req: Request, res: Response) => {
    try {
        const {userID} = req;
        const chats = await getChats(userID);
        res.status(200).json(chats ?? []);
    } catch (error) {
        res.status(500).end();
    }
}