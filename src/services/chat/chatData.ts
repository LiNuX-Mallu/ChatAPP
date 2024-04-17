import Chat from "../../models/Chat"

export default async (chatID: string) => {
    try {
        const chat = await Chat.findById(chatID)
        .populate({
            path: 'createdBy',
            model: 'User',
            select: 'username',
        }).populate({
            path: 'members.memberID',
            model: 'User',
            select: 'online'
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