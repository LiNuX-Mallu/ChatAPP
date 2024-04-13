import User from "../../models/User";
import bcrypt from "bcrypt";

export default async (username: string, pass: string) => {
    try {
        const user = await User.findOne({username}, {chats: 0});
        if (user && await bcrypt.compare(pass, user.password)) {
            return {userID: user._id, username: user.username};
        }
        return null;
    } catch (error) {
        throw error;
    }
}