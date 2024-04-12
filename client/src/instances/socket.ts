import { io } from "socket.io-client";
import { server } from "../contants/urls";

export const socket = io(server, {
    autoConnect: false,
    withCredentials: true,
});