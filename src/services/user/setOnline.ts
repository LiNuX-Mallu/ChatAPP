import User from "../../models/User";

export default async (userID: string, isOnline: boolean) => {
    if (!userID) return undefined;
    try {
        return await User.findByIdAndUpdate(userID, {
            online: isOnline,
        }, {new: true});
    } catch (error) {
        throw error;
    }
}