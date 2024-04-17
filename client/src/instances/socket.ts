import { io } from "socket.io-client";
const server = import.meta.env.VITE_SERVER_URL;

export default io(server, {
  autoConnect: false,
  withCredentials: true,
});
