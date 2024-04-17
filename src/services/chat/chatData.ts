import Chat from "../../models/Chat"

export default async (chatID: string) => {
    try {
        const chat = await Chat.findById(chatID)
        .populate({
            path: 'createdBy',
            model: 'User',
            select: 'username avatar',
        }).populate({
            path: 'members.memberID',
            model: 'User',
            select: 'online avatar username'
        }).populate({
            path: 'messages.sender',
            model: 'User',
            select: 'online avatar username'
        });
        if (chat) {
            return chat;
        } else {
            throw new Error("Cannot find chat");
        }
    } catch(error) {
        throw error;
    }
}