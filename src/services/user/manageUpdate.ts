import User from "../../models/User"

export default async (username: string, userID: string, avatar: string) => {
    if (!avatar || !username) throw new Error("Unknown error");
    try {
        const usernameExist = await User.findOne({username});
        if (usernameExist && usernameExist._id.toString() !== userID) {
            return 400;
        }
        return await User.findByIdAndUpdate(userID, {
            username,
            avatar,
        }, {new: true});
    } catch(error) {
        throw error;
    }
}