import { Schema, model } from "mongoose";

const chatSchema = new Schema({
    chatName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    messages: [
        {
            sender: {
                username: {
                    type: String,
                    required: true,
                },
                id: {
                    type: Schema.Types.ObjectId,
                    required: true,
                }
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
        ref: 'User'
    },
    createdAt: {
        type: Date,
        required: true,
    },
    members: [
        {
            memberID: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            joinedOn: {
                type: Date,
                required: true,
            },
            isAdmin: {
                type: Boolean,
                default: false,
            }
        }
    ],
});

export default model('Chat', chatSchema);