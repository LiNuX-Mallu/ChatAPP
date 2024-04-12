import User from "../../models/User";
import bcrypt from "bcrypt";

export default async (username: string, pass: string) => {
    try {
        const user = await User.findOne({username});
        if (user && await bcrypt.compare(pass, user.password)) {
            return user;
        }
        return null;
    } catch (error) {
        throw error;
    }
}