import { useSelector } from "react-redux";
import { stateType } from "../../store/stateType";
import { useEffect, useState } from "react";
import avatars from "../../constants/avatars";
import axios from "../../instances/axios";
import { useDispatch } from "react-redux";
import { userAvatarAction, usernameAction } from "../../store/actions";

interface Props {
    setUpdateUser: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Avatar({setUpdateUser}: Props) {
    const username = useSelector((state: stateType) => state.username);
    const userAvatar = useSelector((state: stateType) => state.userAvatar) ?? 'demo.jpg'

    const dispatch = useDispatch();

    const [newUsername, setNewUsername] = useState(username);
    const [avatarIndex, setAvatarIndex] = useState(avatars.indexOf(userAvatar));
    const [newAvatar, setNewAvatar] = useState(avatars[avatarIndex]);

    useEffect(() => {
        setNewAvatar(avatars[avatarIndex]);
    }, [avatarIndex]);

    const handleSave = () => {
        axios.put('/user', {username: newUsername, avatar: newAvatar}, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            if (res.status === 200) {
                dispatch({type: usernameAction, payload: res.data?.username ?? null});
                dispatch({type: userAvatarAction, payload: res.data?.avatar ?? null});
                setUpdateUser(false);
            }
        }).catch((err) => {
            if (err.response.status === 400) {
                confirm(err.response.data.message);
            }
        });
    }

    return (
        <div className="fixed flex justify-center gap-32 md:gap-0 md:justify-between flex-col pb-6 pt-10 items-center z-50 top-0 bottom-0 left-0 right-0 md:top-1/4 md:bottom-1/4 md:left-1/3 md:right-1/3 bg-slate-900 rounded-md">

            {/* close button */}
            <i onClick={() => setUpdateUser(false)} className="fa-regular fa-circle-xmark right-4 absolute top-4 text-gray-200 hover:scale-105 cursor-pointer"></i>

            <div className="w-full relative flex items-center justify-center">

                {/* avatar change left button */}
                <i onClick={() => {
                    avatars[avatarIndex - 1] && setAvatarIndex(avatarIndex - 1);
                }} className={`text-slate-400 absolute left-24 text-4xl fa-solid fa-angle-left ${avatars[avatarIndex - 1] ? 'hover:scale-110 hover:text-white cursor-pointer' : 'cursor-not-allowed'}`}></i>

                {/* avatar change right button */}
                <i onClick={() => {
                    avatars[avatarIndex + 1] && setAvatarIndex(avatarIndex + 1);
                }} className={`text-slate-400 absolute right-24 text-4xl fa-solid fa-angle-right ${avatars[avatarIndex + 1] ? 'hover:scale-110 hover:text-white cursor-pointer' : 'cursor-not-allowed'}`}></i>

                <div className="rounded-full overflow-hidden h-24 w-24 border">
                    <img 
                        style={{
                            imageRendering: 'crisp-edges',
                            imageOrientation: "from-image",
                            imageResolution: "from-image",
                        }} 
                        className="object-cover w-full h-full object-center" src={'/avatars/'+newAvatar} 
                        alt="avatar" 
                    />
                </div>
            </div>

            {/* username edit */}
            <div className="flex gap-1 w-full items-center justify-center">
                <input
                    type="text" 
                    onChange={(e) => setNewUsername(e.target.value)}
                    value={newUsername ?? 'loading...'}
                    className="bg-slate-800 text-sm pt-1 pb-1 text-gray-100 text-center border-2 rounded-md border-gray-400"
                />
                <i onClick={() => setNewUsername(username)} className="fa-solid cursor-pointer hover:scale-105 text-xl rounded-md bg-white ps-1 pe-1 font-semibold fa-rotate-left"></i>
            </div>

            {/* save button */}
            <button onClick={handleSave} className="bg-blue-800 hover:scale-105 text-sm p-1 font-[Lexend] ps-3 pe-3 text-gray-100 rounded-sm">Save</button>
        </div>
    )
}