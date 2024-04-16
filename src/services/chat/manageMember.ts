import Chat from "../../models/Chat"
import User from "../../models/User"

export default async (userID: string, chatID: string, remove: boolean) => {
    if (!chatID || !userID) return false;
    try {
        const userUpdate = remove ? {$pull: {chats: chatID}} : {$push: {chats: chatID}};

        const user = await User.findByIdAndUpdate(userID, userUpdate, {new: true});

        const member = {
            memberID: userID,
            joinedOn: new Date(),
            isAdmin: false,
        }

        const chatUpdate = remove ? {$pull: {members: {memberID: userID}}} : {$push: {members: member}};

        const chat = await Chat.findByIdAndUpdate(chatID, chatUpdate, {new: true});

        if (chat && user) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        throw error;
    }
}