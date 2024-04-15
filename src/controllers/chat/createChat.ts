import { Request, Response } from "express";
import newChat from "../../services/chat/newChat";

export default async (req: Request, res: Response) => {
    try {
        const {userID} = req;
        const {chatName, description} = req.body;
        
        const chat = await newChat({chatName, description, userID});
        if (chat) {
            res.status(200).json(chat);
        } else {
            throw new Error("Unknown error");
        }
    } catch (error) {
        res.status(500).end();
        console.error(error);
    }
}