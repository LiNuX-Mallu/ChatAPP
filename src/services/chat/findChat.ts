import { isValidObjectId, MongooseQueryOptions, Query } from "mongoose";
import Chat from "../../models/Chat"

export default async (keyword: string) => {
    try {
        const query: any = {
            $or: [
                {chatName: {$regex: new RegExp(keyword, 'i')}},
            ]
        };
        isValidObjectId(keyword) && query.$or.push({_id: keyword});

        return await Chat.find(query) ?? [];
    } catch (error) {
        throw error;
    }
}