import { Message } from "./Message";

export interface Chat {
    _id: string;
    chatName: string;
    messages: Message[];
    createdBy: {username: string};
    createdAt: Date;
    members: [
        {
            memberID: string;
            joinedOn: Date;
            isAdmin: boolean;
        }
    ],
}

