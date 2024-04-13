import { useDispatch } from "react-redux"
import { userIdAction, usernameAction } from "../../store/actions";
import { useNavigate } from "react-router-dom";
import axios from "../../instances/axios";
import { useSelector } from "react-redux";
import { stateType } from "../../store/stateType";

export default function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const username = useSelector((state: stateType) => state.username);

    const handleLogout = () => {
        axios.post('/user/logout')
        .finally(() => {
            dispatch({type: usernameAction, payload: null});
            dispatch({type: userIdAction, payload: null});
            navigate('/login');
        });
    }

    return (
        <div className="text-gray-100 w-full h-[10vh] bg-gray-600 flex flex-row justify-between items-center ps-5 pe-5">
            <div className="flex items-center gap-1 font-medium hover:scale-105 cursor-pointer">
                <span className="border w-7 h-7 rounded-full bg-black"></span>
                <span>{username ? username : 'Username'}</span>
            </div>
            <button onClick={handleLogout} className="font-medium hover:scale-105 flex items-center gap-2">
                Logout
                <i className="fa-solid fa-right-from-bracket"></i>
            </button>
        </div>
    )
}