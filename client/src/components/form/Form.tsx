import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom"
import axios from "../../instances/axios";
import { useDispatch } from "react-redux";
import { userIdAction, usernameAction } from "../../store/actions";

interface Props {
    forLogin: boolean,
}

export default function Form({forLogin}: Props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [confPass, setConfPass] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSignup = (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        if (username.trim().length === 0) return alert('Enter Username');
        if (email.trim().length === 0) return alert('Enter Email');
        if (pass.trim().length === 0) return alert('Enter Password');

        if (confPass !== pass) {
            return alert('Passwords doesnt match');
        }
        axios.post('/user/signup', {username, email, pass}, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            if (res.status === 200) {
                return navigate('/login');
            }
        }).catch((err) => {
            const errors = err.response.data.errors;
            if (err.response.status === 400) {
                if (errors.username) {
                    setError(errors.username)
                } else if (errors.email) {
                    setError(errors.email);
                } else if (errors.pass) {
                    setError(errors.pass);
                } else {
                    setError("Internal server error");
                }
            }
        });
    }

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        axios.post('/user/login', {username, pass}, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            if (res.status === 200) {
                dispatch({type: userIdAction, payload: res.data?.userID ?? null});
                dispatch({type: usernameAction, payload: res.data?.username ?? null});
                navigate('/');
            }
        }).catch((err) => {
            if (err.response.status === 400) {
                setError(err.response.data.message);
            }
        })
    }

    const handlePage = () => {
        if (forLogin) {
            navigate('/signup');
        } else {
            navigate('/login');
        }
    }

    return (
        <div className="bg-white h-[100vh] w-[100%] md:w-[30%] md:h-[75%] rounded-md flex justify-between flex-col items-stretch p-3 pt-10">
            <h1 className="text-center text-slate-600 font-medium text-2xl">
                {forLogin ? "Login" : "Signup Here"}
            </h1>
            {error !== null && <p className="m-2 mt-5 text-sm text-red-600 text-center font-medium">{error}</p>}
            <form onSubmit={forLogin ? handleLogin : handleSignup} className="flex justify-between gap-5 items-center flex-col p-5 font-medium">
                {forLogin ? 
                <>
                    <div className="flex flex-col w-[100%]">
                        <input onChange={(e) => setUsername(e.target.value)} className="border-2 rounded-md p-1 border-slate-500 outline-none" type="text" id="username" placeholder="Username" />
                    </div>
                    <div className="flex flex-col w-[100%]">
                        <input onChange={(e) => setPass(e.target.value)} className="border-2 rounded-md p-1 border-slate-500 outline-none" type="password" id="password" placeholder="Password" />
                    </div>
                </>
                :
                <>
                    <div className="flex flex-col w-[100%]">
                        <input onChange={(e) => setUsername(e.target.value)} className="border-2 rounded-md p-1 border-slate-500 outline-none" type="text" id="username" placeholder="Username" />
                    </div>
                    <div className="flex flex-col w-[100%]">
                        <input onChange={(e) => setEmail(e.target.value)} className="border-2 rounded-md p-1 border-slate-500 outline-none" type="email" id="email" placeholder="Email" />
                    </div>
                    <div className="flex flex-col w-[100%]">
                        <input onChange={(e) => setPass(e.target.value)} className="border-2 rounded-md p-1 border-slate-500 outline-none" type="password" id="pass" placeholder="Password" />
                    </div>
                    <div className="flex flex-col w-[100%]">
                        <input onChange={(e) => setConfPass(e.target.value)} className="border-2 rounded-md p-1 border-slate-500 outline-none" type="password" id="confpass" placeholder="Confirm Password" />
                    </div>
                    
                </>}

                <div className="mt-5 flex flex-col w-[100%] items-center justify-center">
                    <button className="bg-blue-500 rounded-md pt-1 pb-1 w-[30%] text-white" type="submit">{forLogin ? 'Login' : 'Signup'}</button>
                </div>
                <div className="mt-2 flex flex-col w-[100%] items-center justify-center">
                    <p onClick={handlePage} className="font-medium text-sm text-blue-800 cursor-pointer">
                        {forLogin ? "Don't have an account?" : "Already have an account?"}
                    </p>
                </div>
            </form>
        </div>
    )
}