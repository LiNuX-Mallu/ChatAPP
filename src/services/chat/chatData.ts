import Chat from "../../models/Chat"

export default async (chatID: string) => {
    try {
        const chat = await Chat.findById(chatID);
        if (chat) {
            return chat;
        } else {
            throw new Error("Cannot find chat");
        }
    } catch(error) {
        throw error;
    }
}