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
    setChatOpen: React.Dispatch<React.SetStateAction<string | null>>
}

//color picker function for profile pic
const colorPicker = (name: string, colors = color) => {
    const index = (name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % colors.length;
    return colors[index];
}

export default function Chat({chatID, socket, setChatOpen}: Props) {
    const [chat, setChat] = useState<ChatInterface | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState<string | null>(null);
    const [showOptions, setShowOption] = useState(false);
    const [messageOption, setMessageOption] = useState<string | null>(null);
    const [online, setOnline] = useState<{[key: string]: boolean}>({});

    const userID = useSelector((state: stateType) => state.userID);
    const username = useSelector((state: stateType) => state.username);

    const chatRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    //fetching chat details based on chatID
    useEffect(() => {
        setMessages([]);
        axios.get('/chat/get/'+chatID)
        .then((res) => {
            const data: ChatInterface = res.data;
            setChat(res.data);
            setMessages(data.messages);

            // fetching online status
            const obj:{[key: string]: boolean} = {};
            data.members.forEach((member) => obj[member.memberID._id] = member.memberID.online ?? false);
            setOnline(obj)
        });
        return () => {
            setMessages([]);
        }
    }, [chatID]);

    //receive online status function
    const receiveOnline = useCallback((data: {userID: string, isOnline: boolean}) => {
        setOnline((pre) => {
            return {...pre, [data.userID]: data.isOnline}
        })
    }, []);

    //receive typing status function
    const receiveTyping = useCallback((data: {username: string, isTyping: boolean}) => {
        if (data.username === username) return;
        if (data.isTyping) {
            setIsTyping(data.username);
        } else if (data.username === isTyping) {
            setIsTyping(null);
        }
    }, [isTyping, username]);

    //receive unsend function
    const receiveUnsend = useCallback((data: {userID: string, timestamp: Date}) => {
        if (data.userID !== userID) {
            setMessages((pre) => [...pre].filter((msg) => msg.timestamp.toString() !== data.timestamp.toString()));
        }
    }, [userID]);

    //receive message function
    const receiveMessage = useCallback((message: Message) => {
        if (message.sender.id !== userID) {
            setMessages((pre) => [...pre, message]);
        }
    }, [userID]);

    //socket listeners and join chat
    useEffect(() => {
        if (socket && chat?._id) {
            socket.emit('joinChat', chat._id);
            socket.on('receiveMessage', receiveMessage);
            socket.on('receiveTyping', receiveTyping);
            socket.on('receiveUnsend', receiveUnsend);
            socket.on('receiveOnline', receiveOnline);
        }
        return () => {
            socket.emit('leaveChat', chat?._id);
            socket.off('receiveMessage', receiveMessage);
            socket.off('receiveTyping', receiveTyping);
            socket.off('receiveUnsend', receiveUnsend);
            socket.off('receiveOnline', receiveOnline);
        }
    }, [socket, chat, userID, receiveTyping, receiveUnsend, receiveMessage, receiveOnline]);

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

    const handleLeaveChat = () => {
        if (!userID || !chatID) return undefined;
        axios.post('/chat/leave', {chatID, userID}, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(() => {
            setChatOpen(null);
        });
    }

    const handleUnsend = (timestamp: Date) => {
        if (!userID || !chatID) return;
        socket.emit('sendUnsend', {timestamp, userID, chatID});
        setMessages((pre) => [...pre].filter((msg) => msg.timestamp.toString() !== timestamp.toString()));
    }
    
    return (
        <div onClick={(e) => {
            e.stopPropagation();
            showOptions && setShowOption(false);
            messageOption && setMessageOption(null);
        }} ref={chatRef} className="w-full h-full overflow-scroll">
            {/* topbar */}
            <div className="bg-gray-800 z-10 ps-5 absolute h-16 left-0 right-0 top-0 flex flex-1 flex-row p-1 w-full items-center justify-between gap-2">
                <div className="flex items-center justify-between gap-2">
                    <i onClick={() => setChatOpen(null)} className="fa-solid fa-chevron-left text-lg text-gray-200 hover:text-white"></i>
                    <span style={{backgroundColor: colorPicker(chat?.chatName ?? 'red')}} className="border w-7 h-7 rounded-full uppercase flex justify-center items-center text-center font-semibold">
                        {chat?.chatName[0] ?? ''}
                    </span>
                    <span className="font-[Lexend] text-slate-100 text-md">{chat?.chatName ?? 'loading...'}</span>
                </div>

                {/* option button */}
                <i onClick={() => setShowOption(!showOptions)} className="fa-solid text-xl fa-ellipsis-vertical pe-4"></i>

                {/* option ui */}
                {showOptions === true &&
                <div className="gap-3  pb-4 w-36 flex flex-col text-center absolute pt-5 z-50 bg-slate-800 border border-gray-500 top-5 rounded-sm right-10">
                    {/* leave chat button */}
                    <span onClick={handleLeaveChat} className="text-sm text-red-500 hover:scale-105">Leave Chat</span>

                    {/* copy ID button */}
                    <span onClick={() => {
                            navigator.clipboard.writeText(chat?._id ?? 'copy again').then(() => {
                                alert('Copied to clipboard');
                            });
                        }} className="text-sm flex hover:scale-105 gap-1 text-center items-center justify-center">
                        Chat ID
                        <i className="fa-regular fa-copy"></i>
                    </span>
                </div>}
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
            <div className="w-[100%] pb-20 pt-20 min-h-full top-16 bottom-16 overflow-x-hidden overflow-y-scroll gap-2 flex p-5 flex-col justify-end relative">
                {messages.map((message: Message) => {
                    return (
                        <div
                            key={message.timestamp.toString()}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                if(message.sender.id === userID) {
                                    setMessageOption(message.timestamp.toString());
                                }
                            }}
                            className={`flex relative gap-2 ${message.sender.id === userID ? 'self-end': 'self-start'}`}
                        >

                            {/* profile icon */}
                            {message.sender.id !== userID &&
                            <span 
                                style={{backgroundColor: colorPicker(message.sender.username ?? 'c2')}}
                                className={`relative rounded-full uppercase h-7 w-7 flex justify-center items-center text-center font-semibold text-sm`}
                                >
                                {message.sender.username[0] ?? ''}

                                {/* UI for online status */}
                                {
                                    (online[message.sender.id] && online[message.sender.id] === true) && 
                                    <div className="absolute -top-1 -left-1 w-4 h-4 bg-green-500 rounded-full"></div>
                                }
                            </span>
                            }

                            {/* unsend button */}
                            {messageOption === message.timestamp.toString() &&
                                <button onClick={() => handleUnsend(message.timestamp)} className="font-[Lexend] p-1 rounded-full text-sm h-min self-center ps-2 pe-2 bg-transparent border text-white">
                                    Unsend
                                </button>
                            }

                            {/* message container */}
                            <div
                                className={`
                                    ${message.sender.id === userID ?
                                        (messageOption === message.timestamp.toString() ? 'bg-sky-700' : 'bg-gray-800')
                                        :
                                        'bg-slate-800'}
                                    rounded-md overflow-hidden flex flex-col
                                `}
                                key={message.timestamp.toString()}
                                >

                                {/* username */}
                                {message.sender.id !== userID && <span className="w-full text-sm p-2 pt-1 text-slate-300">{message.sender.username}</span>}

                                {/* message */}
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