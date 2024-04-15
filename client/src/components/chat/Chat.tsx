import { useEffect, useState } from "react";
import axios from "../../instances/axios";
import { Chat as ChatInterface } from "../../interfaces/Chat";
import color from "../../constants/colors";
import { Socket } from "socket.io-client";

interface Props {
    chatID: string;
    socket: Socket;
}

const colorPicker = (name: string, colors = color) => {
    const index = (name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % colors.length;
    return colors[index];
}

export default function Chat({chatID, socket}: Props) {
    const [chat, setChat] = useState<ChatInterface | null>(null);
    const [input, setInput] = useState("");

    useEffect(() => {
        axios.get('/chat/'+chatID)
        .then((res) => {
            setChat(res.data);
        })
    }, [chatID]);

    useEffect(() => {
        if (socket && chat?._id) {
            socket.emit('joinChat', chat._id);
        }
        () => {
            socket.emit('leaveChat', chat?._id);
        }
    }, [socket, chat]);
    
    return (
        <div className="overflow-x-hidden overflow-y-scroll w-full h-full flex justify-center items-center">
            <div className="bg-gray-800 ps-5 absolute h-16 left-0 right-0 top-0 flex flex-1 flex-row p-1 w-full items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <span style={{backgroundColor: colorPicker(chat?.chatName ?? 'red')}} className="border w-8 h-8 rounded-full uppercase flex justify-center items-center text-center font-semibold">
                        {chat?.chatName[0] ?? ''}
                    </span>
                    <span className="font-[Lexend] text-md">{chat?.chatName ?? 'loading...'}</span>
                </div>
                <i className="fa-solid text-xl fa-ellipsis-vertical pe-4"></i>
            </div>
            <div className="bg-gray-800 ps-5 absolute h-14 left-0 right-0 bottom-0 flex flex-1 flex-row p-1 w-full items-center justify-between gap-2">
                <textarea
                    className="w-full resize-none bg-transparent outline-none flex items-center"
                    rows={1}
                    placeholder="Type here"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    >
                </textarea>
                {input.length > 0 && <i className="fa-solid text-gray-300 fa-paper-plane pe-4 text-xl hover:text-white cursor-auto"></i>}
            </div>
        </div>
    )
}