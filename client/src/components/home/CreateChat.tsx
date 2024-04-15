import { useState } from "react";
import axios from "../../instances/axios";
import { Chat } from "../../interfaces/Chat";

interface Props {
    create: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateChat({create}: Props) {
    const [chatName, setChatName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState<null | string>(null);
    const [chat, setChat] = useState<Chat | null>(null);

    const handleCreate = () => {
        setError(null);
        if (chatName.trim().length <= 3) {
            setError('Chat name should be atleast 3 characters');
            return;
        }
        axios.post('/chat/create', {chatName, description}, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            if (res.status === 200) {
                setChat(res.data);
            }
        }).catch(() => {
            setError("Something went wrong");
        });
    }

    return (
        <div 
            onClick={(e) => e.stopPropagation()}
            className="pt-10 pb-5 flex fixed left-0 right-0 top-0 bottom-0 md:right-[30%] md:top-[20%] md:left-[30%] md:bottom-[20%] bg-gray-900 rounded-md flex-col justify-between items-center"
        >
            {/* close icon for small screens*/}
            <i onClick={() => create(false)} className="absolute md:hidden text-white top-3 right-3 fa-regular fa-circle-xmark"></i>

            <h1 className="text-2xl font-semibold mb-10 text-gray-300">Create Chat</h1>

            {/* validation error */}
            {error !== null && <p className="text-red-600 text-sm text-center">{error}</p>}

            <div className="flex flex-col justify-center items-center w-full gap-2">
                <input onChange={(e) => setChatName(e.target.value)} type="text" placeholder="Chat Name" className="w-2/3 ps-3 p-2 capitalize font-medium text-gray-200 text-sm  border-0 outline-none rounded-sm bg-slate-700" />
                <textarea onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" rows={5} className="w-2/3 p-1 ps-3 font-medium text-gray-200 text-sm border-0 outline-none rounded-sm resize-none bg-slate-700"></textarea>
            </div>

            {chat === null && <button onClick={handleCreate} className="bg-gray-800 text-gray-200 p-1 ps-3 text-md pe-3 rounded-md font-medium">Create</button>}

            {chat !== null &&
                <div
                    onClick={() => {
                        navigator.clipboard.writeText(chat._id).then(() => {
                          alert('Copied to clipboard');
                        });
                    }}
                    className="text-gray-300 font-medium text-sm gap-2 flex items-center justify-center text-center hover:scale-105 hover:text-white cursor-pointer"
                    >
                    <span>Copy Chat ID</span>
                    <i className="fa-regular fa-copy"></i>
                </div>
            }
        </div>
    )
}