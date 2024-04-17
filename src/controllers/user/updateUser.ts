import { Request, Response } from "express";
import manageUpdate from "../../services/user/manageUpdate";

export default async (req: Request, res: Response) => {
    try {
        const {userID} = req;
        const {username, avatar} = req.body;
        const updatedUser = await manageUpdate(username, userID, avatar);
        if (updatedUser !== 400 && updatedUser !== null) {
            return res.status(200).json(updatedUser);
        } else if (updatedUser === 400) {
            return res.status(400).json({message: "Username already exist"});
        } else {
            throw new Error("Unknow error");
        }
    } catch(error) {
        res.status(500).end();
        console.error(error);
    }
}