import { Request, Response, NextFunction } from "express"
import User from "../models/User";

type Errors = {
    username: string,
    email: string,
    pass: string,
}

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            username,
            email,
            pass,
        } = req.body;

        const errors = <Errors>{};

        const passRegex = /^.{8,}$/;
        const usernameRegex = /^[a-z0-9_.]{3,}$/;
        const emailRegex = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;

        if (!passRegex.test(pass)) {
            errors.pass = "Password must atleast have 8 characters";
        }

        if (!usernameRegex.test(username)) {
            errors.username = "provide a valid username";
        } else if (await User.findOne({username})) {
            errors.username = "username already exist";
        }

        if (!emailRegex.test(email)) {
            errors.email = "provide a valid email address";
        }

        if (Object.keys(errors).length === 0) {
            next();
        } else {
            return res.status(400).json({message: "Validation failed", errors});
        }
    } catch (error) {
        return res.status(500).end();
    }
}