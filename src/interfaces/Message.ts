import { Schema } from "mongoose";

export interface Message {
    sender: Schema.Types.ObjectId;
    messageType: string;
    message: string;
    timestamp: Date;
}