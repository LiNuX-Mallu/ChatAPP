import { Message } from "../../interfaces/Message";
import Chat from "../../models/Chat";

export default async (chatID: string, message: Message) => {
    if (!chatID || !message) return false;
    try {
        const chat = await Chat.findByIdAndUpdate(chatID, {
            $push: {messages: message},
        }, {new: true});

        if (chat) {
            return true;
        } return false;
    } catch (error) {
        throw error;
    }
}