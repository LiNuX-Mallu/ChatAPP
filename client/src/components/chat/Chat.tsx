import { useEffect, useState } from "react";
import axios from "../../instances/axios";
import { Chat as ChatInterface } from "../../interfaces/Chat";
import color from "../../constants/colors";
import { Socket } from "socket.io-client";
import { Message } from "../../interfaces/Message";
import { useSelector } from "react-redux";
import { stateType } from "../../store/stateType";

interface Props {
    chatID: string;
    socket: Socket;
}

//color picker function for profile pic
const colorPicker = (name: string, colors = color) => {
    const index = (name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % colors.length;
    return colors[index];
}

export default function Chat({chatID, socket}: Props) {
    const [chat, setChat] = useState<ChatInterface | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<Message | null>(null)
    const [input, setInput] = useState("");
    const userID = useSelector((state: stateType) => state.userID);
    const username = useSelector((state: stateType) => state.username);

    //fetching chat details based on chatID
    useEffect(() => {
        setMessages([]);
        axios.get('/chat/get/'+chatID)
        .then((res) => {
            setChat(res.data);
            setMessages(res.data.messages);
        });
        return () => {
            setMessages([]);
        }
    }, [chatID]);


    //socket listeners and join chat
    useEffect(() => {
        function receiveMessage(message: Message) {
            if (message.sender.id !== userID) {
                setNewMessage(message);
            }
        }
        if (socket && chat?._id) {
            socket.emit('joinChat', chat._id);
            socket.on('receiveMessage', receiveMessage);
        }
        return () => {
            socket.emit('leaveChat', chat?._id);
            socket.off('receiveMessage', receiveMessage);
        }
    }, [socket, chat, userID]);

    //handling new message
    useEffect(() => {
        if ((newMessage === null)
        ||
        (messages.length && messages[messages.length - 1].timestamp === newMessage.timestamp))
        {
            return undefined;
        }
        setMessages([...messages, newMessage]);
    }, [messages, newMessage]);

    //send message handler
    function sendMessage() {
        if (userID === null || username === null || !socket || !chat) return undefined;
        const message: Message = {
            sender: {username: username, id: userID},
            message: input,
            timestamp: new Date(),
            messageType: 'text',
        }
        setMessages([...messages, message]);
        socket.emit('sendMessage', {chatID: chat?._id, message});
        setInput("");
    }
    
    return (
        <div className="w-full h-full overflow-scroll">
            {/* topbar */}
            <div className="bg-gray-800 z-10 ps-5 absolute h-16 left-0 right-0 top-0 flex flex-1 flex-row p-1 w-full items-center justify-between gap-2">
                <div className="flex items-center justify-between gap-2">
                    <span style={{backgroundColor: colorPicker(chat?.chatName ?? 'red')}} className="border w-8 h-8 rounded-full uppercase flex justify-center items-center text-center font-semibold">
                        {chat?.chatName[0] ?? ''}
                    </span>
                    <span className="font-[Lexend] text-md">{chat?.chatName ?? 'loading...'}</span>
                </div>
                <i className="fa-solid text-xl fa-ellipsis-vertical pe-4"></i>
            </div>

            {/*profile space */}
            {messages.length === 0 &&
            <div className="flex pb-20 pt-20 flex-col absolute top-16 bottom-16 items-center justify-center bg-slate-700 w-full">
                <div className="flex gap-2 h-full w-full flex-col items-center justify-center text-center">
                    <span style={{backgroundColor: colorPicker(chat?.chatName ?? 'c2')}} className="border w-16 h-16 rounded-full uppercase flex justify-center items-center text-center font-semibold text-2xl">
                        {chat?.chatName[0] ?? ''}
                    </span>
                    <span className="font-[Lexend]">{chat?.chatName ?? 'loading'}</span>
                    <p className="font-medium text-sm text-gray-400">Chat create by {chat?.createdBy.username} on {chat ? new Date(chat?.createdAt).toDateString() : ''}</p>
                </div>
            </div>}


            {/* message space */}
            {messages.length !== 0 &&
            <div className="w-full pb-20 pt-20 top-16 bottom-16 overflow-y-scroll justify-end gap-2 flex p-5 flex-col">
                {messages.map((message: Message) => {
                    return (
                        <div
                            className={`bg-gray-900 flex rounded-md min-w-20 ${message.sender.id === userID ? 'self-end': 'self-start'}`}
                            key={message.timestamp.toString()}
                            >
                            <p className="whitespace-pre-wrap w-full h-full text-center p-2 ps-4 pe-4 font-[Lexend] text-sm">{message.message}</p>
                        </div>
                    )
                })}
            </div>}

            {/* typebox */}
            <div className="bg-gray-800 z-10 ps-5 absolute h-16 left-0 right-0 bottom-0 flex flex-1 flex-row p-1 w-full items-center justify-between gap-2">
                <textarea
                    className="w-full resize-none bg-transparent outline-none flex items-center"
                    rows={1}
                    placeholder="Type here"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    >
                </textarea>
                {input.length > 0 && <i onClick={sendMessage} className="fa-solid text-gray-300 fa-paper-plane pe-4 text-xl hover:text-white cursor-auto"></i>}
            </div>
        </div>
    )
}