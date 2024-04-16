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
    setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}

const colorPicker = (name: string, colors = color) => {
    const index = (name.charCodeAt(0) + name.charCodeAt(name.length-1)) % colors.length;
    return colors[index];
}

export default function Sidebar({chats, createChat, selected, setChats}: Props) {
    const username = useSelector((state: stateType) => state.username);
    const userID = useSelector((state: stateType) => state.userID);

    const [searchChats, setSearchChats] = useState<Chat[]>([]);
    const [search, setSearch] = useState("");

    const [showOptions, setShowOptions] = useState<string | null>(null);

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

    const handleChatClick = (id: string) => {
        const chatExist = chats.find(chat => chat._id === id);
        if (chatExist) {
            return selected(id);
        }
        const confirmed = window.confirm('Click ok to join this group');
        if (confirmed) {
            axios.post('/chat/join', {chatID: id, userID}, {
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(() => selected(id));
        }
    }

    const handleLeaveChat = (id: string) => {
        if (!userID) return undefined;
        axios.post('/chat/leave', {chatID: id, userID}, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(() => {
            const newChats = [...chats].filter((chat) => chat._id !== id);
            setChats(newChats);
            setShowOptions(null);
        });
    }

    return (
        <div onClick={(e) => {
            e.stopPropagation();
            showOptions && setShowOptions(null);
        }} className="overflow-x-hidden overflow-y-scroll w-full h-full bg-gray-800">
            {/* topbar */}
            <div className="bg-gray-800 z-50 absolute flex w-full flex-col p-1 items-center justify-between gap-5 pt-5 pb-2">

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
                    <div
                        onClick={() => handleChatClick(chat._id)}
                        key={chat._id}
                        className="flex relative flex-row p-5 ps-3 gap-2 border-r-4 border-r-transparent items-center hover:bg-gray-700 hover:border-r-4 hover:border-r-gray-300"
                        >

                        {/* profile icon */}
                        <span style={{backgroundColor: colorPicker(chat.chatName)}} className="border w-10 h-10 rounded-full uppercase flex justify-center items-center text-center font-semibold">
                            {chat.chatName[0]}
                        </span>

                        {/* chat name and detail */}
                        <div className="flex flex-col items-start text-left gap-1">
                            <span className="capitalize font-[Lexend] text-sm text-gray-200">{chat.chatName}</span>
                            <p className="text-xs text-gray-300 font-normal">Chat created by {chat.createdBy.username}</p>
                        </div>

                        <div className="flex-1 flex item-center flex-col justify-between gap-0 text-right">

                            {/* options */}
                            {showOptions === chat._id &&
                            <div
                                className="right-10 z-10 gap-2 bg-slate-600 absolute text-center rounded-sm flex flex-col items-center justify-between"
                                >
                                {/* leave chat button */}
                                <span onClick={(e) => {
                                        e.stopPropagation();
                                        handleLeaveChat(chat._id);
                                    }} 
                                    className="text-gray-100 flex-1 w-full text-xs hover:bg-red-400 p-2 ps-3 pe-3"
                                >Leave Chat</span>
                            </div>}

                            {/* option button */}
                            <i onClick={(e) => {
                                e.stopPropagation();
                                if (showOptions === chat._id) {
                                    setShowOptions(null);
                                } else {
                                    setShowOptions(chat._id);
                                }
                            }} className="fa-solid text-md fa-ellipsis w-min text-lg self-end"></i>
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