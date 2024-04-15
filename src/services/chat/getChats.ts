import Chat from "../../models/Chat";
import User from "../../models/User";

export default async (userID: string) => {
    try {
        const user = await User.findById(userID);
        if (!user) throw new Error('Cannot find user');

        return await Promise.all(user.chats.map(async (chat) => {
            return await Chat.findById(chat)
            .populate({
                path: 'createdBy',
                model: 'User',
                select: 'username',
            })
            .select({
                'messages': {$slice: [-1, 1]},
            });
        }));
    } catch (error) {
        throw error;
    }
}