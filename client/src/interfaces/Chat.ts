import { Message } from "./Message";

export interface Chat {
    _id: string;
    chatName: string;
    messages: Message[];
    createdBy: {username: string};
    createdAt: Date;
    members: [
        {
            memberID: {online: boolean, _id: string};
            joinedOn: Date;
            isAdmin: boolean;
        }
    ],
}

