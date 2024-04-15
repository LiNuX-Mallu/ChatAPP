import Chat from "../../models/Chat";
import User from "../../models/User";

interface Args {
    chatName: string;
    description: string | undefined;
    userID: string;
}

export default async ({chatName, description, userID}: Args) => {
    try {
        const user = await User.findById(userID);
        if (!user) {
            throw new Error("Cannot find user");
        }
        const newChat = new Chat({
            chatName,
            description,
            messages: [],
            createdBy: userID,
            createdAt: new Date(),
            members: [{memberID: userID, joinedOn: new Date, isAdmin: true}],
        });
        const chatSaved = await newChat.save();
        user.chats.push(chatSaved._id);
        await user.save();
        return chatSaved;
    } catch (error) {
        throw error;
    }
}