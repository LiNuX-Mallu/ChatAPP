export interface Message {
    sender: {username: string, id: string};
    messageType: string;
    message: string;
    timestamp: Date;
}