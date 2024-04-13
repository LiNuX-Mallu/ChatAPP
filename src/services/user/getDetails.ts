import User from "../../models/User";

export default async (userID: string) => {
    try {
        return await User.findById(userID, {username: 1, _id: 1});
    } catch (error) {
        throw error;
    }
};