import Chat from "../../models/Chat"
import User from "../../models/User"

export default async (userID: string, chatID: string) => {
    if (!chatID || !userID) return false;
    try {
        const user = await User.findByIdAndUpdate(chatID, {
            $push: {chats: chatID},
        }, {new: true});

        const member = {
            memberID: userID,
            joinedOn: new Date(),
            isAdmin: false,
        }

        await Chat.findByIdAndUpdate(chatID, {
            $push: {members: member},
        }, {new: true});
        
        return true;
    } catch (error) {
        throw error;
    }
}