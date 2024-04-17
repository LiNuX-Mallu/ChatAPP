export interface Message {
    sender: {username: string, _id: string, avatar: string};
    messageType: string;
    message: string;
    timestamp: Date;
}