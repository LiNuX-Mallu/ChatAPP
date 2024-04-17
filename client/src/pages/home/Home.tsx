import { useEffect, useState } from "react";
import Sidebar from "../../components/home/Sidebar";
import { Chat } from "../../interfaces/Chat";
import CreateChat from "../../components/home/CreateChat";
import axios from "../../instances/axios";
import { userAvatarAction, userIdAction, usernameAction } from "../../store/actions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChatComponent from "../../components/chat/Chat";
import Socket from "../../instances/socket";
import { useSelector } from "react-redux";
import { stateType } from "../../store/stateType";
import Avatar from "../../components/home/Avatar";

export default function Home() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [chatOpen, setChatOpen] = useState<string | null>(null);
    const [createChat, setCreateChat] = useState(false);
    const [updateUser, setUpdateUser] = useState(false);
    const [socket] = useState(Socket.connect());
    const userID = useSelector((state: stateType) => state.userID);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/chat')
        .then((res) => {
            if (res.status === 200) {
                setChats(res.data);
            }
        });
    }, [createChat, chatOpen]);
  
    useEffect(() => {
        axios.get('/user')
        .then((res) => {
            if (res.status === 200) {
                dispatch({type: userIdAction, payload: res.data?.userID ?? null});
                dispatch({type: usernameAction, payload: res.data?.username ?? null});
                dispatch({type: userAvatarAction, payload: res.data?.avatar ?? null});
            }
        }).catch(() => {
            navigate('/login');
        })
    }, [dispatch, navigate]);

    useEffect(() => {
        if (socket && userID) {
            socket.emit('joinApp', userID);
        }
        return () => {
            socket.emit('leaveApp', userID);
        }
    }, [socket, userID])

    return (
        <div onClick={() => {
            setCreateChat(false);
        }} className={`h-[100vh] overflow-hidden w-[100%] ${createChat ? 'backdrop-blur-md' : ''}`}>
            <div className="text-white select-none bg-slate-200 w-[100%] h-[100vh] overflow-scroll flex">

                <div className={`${chatOpen !== null ? 'hidden': 'block'} md:block relative overflow-hidden w-full h-[100vh] md:w-1/3 border-r-2 border-gray-600`}>
                    <Sidebar setUpdateUser={setUpdateUser} setChats={setChats} selected={setChatOpen} createChat={setCreateChat} chats={chats} />
                </div>
                
                <div className={`${chatOpen !== null ? 'block' : 'hidden'} w-full h-full bg-gray-700 md:block relative`}>
                    {chatOpen === null &&
                        <div className="flex w-full h-full justify-center items-center">
                            <p className="text-gray-400 font-normal">Opened chat will visible here</p>
                        </div>
                    }
                    {chatOpen !== null && <ChatComponent setChatOpen={setChatOpen} socket={socket} chatID={chatOpen} />}
                </div>
            </div>
            {createChat && <CreateChat create={setCreateChat} />}
            {updateUser === true && <Avatar setUpdateUser={setUpdateUser} />}
        </div>
    )
}