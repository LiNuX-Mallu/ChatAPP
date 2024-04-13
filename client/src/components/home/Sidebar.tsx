import { Chat } from "../../interfaces/Chat"

interface Props {
    chats: Chat[];
    createChat: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({chats, createChat}: Props) {
    return (
        <div className="overflow-x-hidden overflow-y-scroll w-full md:w-1/4 h-full md:h-full bg-gray-800 flex flex-col gap-1">
            <div className="h-10 bg-tranparent w-full flex flex-row p-1 items-center gap-2">
                <input className="bg-gray-700 flex-1 p-1 ps-2 outline-none" type="text" placeholder="Search here" />
                <i onClick={(e) => {
                    e.stopPropagation();
                    createChat(true)
                }} className="fa-solid fa-user-group cursor-pointer text-xl"></i>
            </div>
            {chats.map((chat) => {
                return (
                    <div key={chat._id} className="flex flex-row p-5 gap-2 items-center hover:bg-gray-700 hover:border-r-4">
                        <span className="border w-8 h-8 rounded-full bg-gray-900"></span>
                        <span className="capitalize">{chat.chatName}</span>
                    </div>
                )
            })}
        </div>
    )
}