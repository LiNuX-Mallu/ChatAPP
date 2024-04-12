import { Schema, model } from "mongoose";

const chatSchema = new Schema({
    chatName: {
        type: String,
        required: true,
    },
    messages: [
        {
            sender: {
                type: Schema.Types.ObjectId,
                required: true,
            },
            messageType: {
                type: String,
                required: true,
            },
            message: {
                type: String,
                required: true,
            },
            timestamp: {
                type: Date,
                required: true,
            },
        }
    ],
    createdBy: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    createdAt: {
        type: Schema.Types.ObjectId,
        required: true,
    },
});

export default model('Chat', chatSchema);