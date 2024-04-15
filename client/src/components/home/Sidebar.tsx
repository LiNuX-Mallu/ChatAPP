import { Chat } from "../../interfaces/Chat"
import color from "../../constants/colors";
import { stateType } from "../../store/stateType";
import { useSelector } from "react-redux";
import { userIdAction, usernameAction } from "../../store/actions";
import axios from "../../instances/axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
interface Props {
    chats: Chat[];
    createChat: React.Dispatch<React.SetStateAction<boolean>>;
    selected: React.Dispatch<React.SetStateAction<string | null>>;
}

const colorPicker = (name: string, colors = color) => {
    const index = (name.charCodeAt(0) + name.charCodeAt(name.length-1)) % colors.length;
    return colors[index];
}

export default function Sidebar({chats, createChat, selected}: Props) {
    const username = useSelector((state: stateType) => state.username);
    const [searchChats, setSearchChats] = useState<Chat[]>([]);
    const [search, setSearch] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        axios.post('/user/logout')
        .finally(() => {
            dispatch({type: usernameAction, payload: null});
            dispatch({type: userIdAction, payload: null});
            navigate('/login');
        });
    }

    useEffect(() => {
        if (search.length === 0) {
            setSearchChats([]);
            return;
        }
        const timeout = setTimeout(() => {
            axios.get('/chat/search?keyword='+search)
            .then((res) => {
                setSearchChats(res.data);
                console.log(res.data);
            })
        }, 200);
        return () => {
            clearTimeout(timeout);
        }
    }, [search]);

    return (
        <div className="overflow-x-hidden overflow-y-scroll w-full h-full bg-gray-800">
            {/* topbar */}
            <div className="bg-gray-800 absolute flex w-full flex-col p-1 items-center justify-between gap-5 pt-5 pb-2">

                {/* username and logout option */}
                <div className="flex ps-2 pe-2 w-full justify-between items-center gap-1 font-medium cursor-pointer">
                    <div className="flex gap-2 items-center">
                        <span className="border border-gray-500 w-8 h-8 rounded-full bg-black"></span>
                        <span>{username ? username : 'Username'}</span>
                    </div>
                    
                    <i onClick={handleLogout} className="fa-solid text-xl text-gray-400 fa-right-from-bracket hover:text-white"></i>
                </div>

                {/* search input and create group icon */}
                <div className="flex w-full items-center gap-2 ps-1 pe-1">
                    <input onChange={(e) => {
                        e.stopPropagation();
                        setSearch(e.target.value)
                    }} className="bg-gray-700 text-gray-300 font-medium flex-1 p-2 ps-3 outline-none rounded-sm" type="text" placeholder="Enter chat name or ID" />
                    <i onClick={(e) => {
                        e.stopPropagation();
                        createChat(true)
                    }} className="fa-solid fa-user-group text-gray-200 cursor-pointer text-xl"></i>
                </div>
            </div>

            {/* chat list */}
            <div className="p-16"></div>
            {(search.length === 0 ? chats : searchChats).map((chat) => {
                return (
                    <div onClick={() => selected(chat._id)} key={chat._id} className="flex flex-row p-5 ps-3 gap-2 border-r-4 border-r-transparent items-center hover:bg-gray-700 hover:border-r-4 hover:border-r-gray-300">
                        <span style={{backgroundColor: colorPicker(chat.chatName)}} className="border w-10 h-10 rounded-full uppercase flex justify-center items-center text-center font-semibold">
                            {chat.chatName[0]}
                        </span>
                        <div className="flex flex-col items-start text-left gap-1 justify-between">
                            <span className="capitalize font-[Lexend] text-sm text-gray-200">{chat.chatName}</span>
                            <p className="text-xs text-gray-300 font-[Lexend]">Chat created by {chat.createdBy.username}</p>
                        </div>
                        <div className="flex-1 flex item-center flex-col justify-between gap-1 text-right">
                            <i className="fa-solid text-md fa-ellipsis"></i>
                            <span className="text-xs text-gray-400">{new Date(chat.createdAt).toDateString() ?? ''}</span>
                        </div>
                    </div>
                )
            })}

            {/* no chats condition */}
            {(search.length === 0 ? chats : searchChats).length === 0 &&
                <p className="font-medium text-center p-2 pt-5">No chat found</p>
            }
        </div>
    )
}