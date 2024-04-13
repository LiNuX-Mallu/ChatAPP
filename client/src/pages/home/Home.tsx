import { useEffect, useState } from "react";
import Sidebar from "../../components/home/Sidebar";
import { Chat } from "../../interfaces/Chat";
import { chatDemos } from "./demos";
import Navbar from "../../components/home/Navbar";
import CreateChat from "../../components/home/CreateChat";
import axios from "../../instances/axios";
import { userIdAction, usernameAction } from "../../store/actions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const [chats] = useState<Chat[]>(chatDemos);
    const [selectedChat] = useState<string | null>(null);
    const [createChat, setCreateChat] = useState(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    useEffect(() => {
        axios.get('/user')
        .then((res) => {
            if (res.status === 200) {
            dispatch({type: userIdAction, payload: res.data?.userID ?? null});
            dispatch({type: usernameAction, payload: res.data?.username ?? null});
            }
        }).catch(() => {
            navigate('/login');
        })
    }, [dispatch, navigate]);

    return (
        <div onClick={() => setCreateChat(false)} className={`h-[100vh] w-[100%] relative ${createChat ? 'backdrop-blur-md' : ''}`}>
            <Navbar />
            <div className="text-white select-none bg-slate-200 w-[100%] h-[90vh] overflow-scroll flex flew-row">
                <Sidebar createChat={setCreateChat} chats={chats} />
                <div className="flex-1 bg-gray-700 hidden md:flex">
                    {selectedChat === null &&
                        <div className="flex w-full h-full justify-center items-center">
                            <p className="text-gray-400 font-normal">Open a chat to visible here</p>
                        </div>
                    }
                </div>
            </div>
            {createChat && <CreateChat create={setCreateChat} />}
        </div>
    )
}