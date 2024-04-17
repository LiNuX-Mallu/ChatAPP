import Chat from "../../models/Chat";

export default async (chatID: string, timestamp: Date, userID: string) => {
    if (!chatID || !timestamp || !userID) return false;
    try {
        return Boolean(await Chat.findByIdAndUpdate(chatID, {
            $pull: {
                messages: {
                    timestamp: {$eq: timestamp},
                    sender: userID,
                }
            }
        }, {new: true}));
    } catch (error) {
        throw error;
    }
}