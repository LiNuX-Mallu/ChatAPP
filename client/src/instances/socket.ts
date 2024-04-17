import { io } from "socket.io-client";
import { server } from "../constants/urls";

export default io(server, {
  autoConnect: true,
  withCredentials: true,
});
