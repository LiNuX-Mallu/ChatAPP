import { Request, Response } from "express";
import getDetails from "../../services/user/getDetails";

export default async (req: Request, res: Response) => {
    try {
        const {userID} = req;
        const userDetails = await getDetails(userID);
        if (userDetails !== null) {
            res.status(200).json({
                username: userDetails.username,
                userID: userDetails._id,
            });
        } else throw new Error("Couldnt fetch user details");
    } catch(error) {
        res.status(500).end();
        console.error(error);
    }
}