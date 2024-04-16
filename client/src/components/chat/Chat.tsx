import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
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
    const [isTyping, setIsTyping] = useState<string | null>(null);

    const chatRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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

    //receive typing statusm function
    const receiveTyping = useCallback((data: {username: string, isTyping: boolean}) => {
        if (data.username === username) return;
        if (data.isTyping) {
            setIsTyping(data.username);
        } else if (data.username === isTyping) {
            setIsTyping(null);
        }
    }, [isTyping, username]);

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
            socket.on('receiveTyping', receiveTyping);
        }
        return () => {
            socket.emit('leaveChat', chat?._id);
            socket.off('receiveMessage', receiveMessage);
            socket.off('receiveTyping', receiveTyping);
        }
    }, [socket, chat, userID, receiveTyping]);

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

    //scroll down
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    //send typing status
    useEffect(() => {
        socket.emit('sendTyping', {
            chatID,
            username: username ?? 'user',
            isTyping: Boolean(input.length !== 0),
        });
    }, [input, chatID, username, socket]);


    //send message handler
    function sendMessage(event: FormEvent) {
        event.preventDefault && event.preventDefault();

        if (input.trim().length === 0) return undefined;
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
        inputRef.current && inputRef.current.focus();
    }
    
    return (
        <div ref={chatRef} className="w-full h-full overflow-scroll">
            {/* topbar */}
            <div className="bg-gray-800 z-10 ps-5 absolute h-16 left-0 right-0 top-0 flex flex-1 flex-row p-1 w-full items-center justify-between gap-2">
                <div className="flex items-center justify-between gap-2">
                    <span style={{backgroundColor: colorPicker(chat?.chatName ?? 'red')}} className="border w-7 h-7 rounded-full uppercase flex justify-center items-center text-center font-semibold">
                        {chat?.chatName[0] ?? ''}
                    </span>
                    <span className="font-[Lexend] text-slate-100 text-md">{chat?.chatName ?? 'loading...'}</span>
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
            <div className="w-[100%] pb-20 pt-20 top-16 bottom-16 overflow-x-hidden overflow-y-scroll justify-end gap-2 flex p-5 flex-col">
                {messages.map((message: Message) => {
                    return (
                        <div className={`flex gap-2 items-start ${message.sender.id === userID ? 'self-end': 'self-start'}`}>
                            {/* profile icon */}
                            {message.sender.id !== userID &&
                            <span 
                                style={{backgroundColor: colorPicker(message.sender.username ?? 'c2')}}
                                className="rounded-full uppercase h-7 w-7 flex justify-center items-center text-center font-semibold text-sm"
                                >
                                {message.sender.username[0] ?? ''}
                            </span>
                            }

                            {/* message container */}
                            <div
                                className={`${message.sender.id === userID ? 'bg-gray-800': 'bg-slate-900'} rounded-md overflow-hidden flex flex-col`}
                                key={message.timestamp.toString()}
                                >
                                {message.sender.id !== userID && <span className="w-full text-sm p-2 pt-1 text-slate-300">{message.sender.username}</span>}
                                <p className={`${message.sender.id === userID ? 'text-gray-100' : 'text-slate-200'} max-w-96 whitespace-break-spaces capitalize font-[Lexend] break-words ps-2 pe-2 pt-1 text-left text-sm`}>
                                    {message?.message ?? ""}
                                </p>
                                <span className={`${message.sender.id === userID ? 'text-gray-400' : 'text-slate-200'} font-light text-right p-1 pe-2 ps-2 text-xs`}>
                                    {new Date(message.timestamp).toLocaleTimeString().toLocaleLowerCase()}
                                </span>
                            </div>
                        </div>
                    )
                })}
                {isTyping !== null && <div className="p-1 text-gray-300 font-[Lexend] pt-2 text-sm">{isTyping} is typing...</div>}
            </div>}

            {/* typebox */}
            <form onSubmit={sendMessage} className="bg-gray-800 border-t-2 border-slate-600 z-10 ps-5 absolute h-16 left-0 right-0 bottom-0 flex flex-1 flex-row p-1 w-full items-center justify-between gap-2">
                <input
                    ref={inputRef}
                    className="w-full bg-transparent text-gray-200 outline-none flex items-center caret-gray-300"
                    placeholder="Type here"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    >
                </input>
                {input.length > 0 && <i onClick={sendMessage} className="fa-solid text-gray-300 fa-paper-plane pe-5 text-xl hover:text-white cursor-pointer"></i>}
            </form>
        </div>
    )
}