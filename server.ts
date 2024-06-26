import express from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connect as mongoConnect } from "mongoose";
import router from "./router";
import { Server, Socket } from "socket.io";
import http from "http";
import path from "path";
import { Message } from "./src/interfaces/Message";
import deleteMessage from "./src/services/chat/deleteMessage";
import setOnline from "./src/services/user/setOnline";
import saveUserMessage from "./src/services/chat/saveMessage";

//env variables
dotenv.config();
let { MONGO_URI, PORT, HOST, CLIENT, DOMAIN } = process.env;

const app = express();

//allowed origins
const allowedOrigins = [
	`http://${HOST}:${PORT}`,
	`http://${CLIENT}`,
	 DOMAIN,
];

//cors configurations
const corsOptions: CorsOptions = {
	origin(requestOrigin, callback) {
		if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
	optionsSuccessStatus: 200, 
	credentials: true,
	preflightContinue: true,
	allowedHeaders: [
		"Accept",
		"Accept-Language",
		"Content-Language",
		"Content-Type",
		"Authorization",
		"Access-Control-Allow-Origin",
	],
}

//app configurtions
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//api router
app.use("/api", router);

//serving react build files
app.use(express.static(path.join(__dirname, '../client/dist'), {index: false}));
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const server = http.createServer(app);

//socket io configuration
const io = new Server(server, {
	cors: corsOptions,
	transports: ["websocket", "polling"],
	allowEIO3: true,
});

//scoket io logics
io.on("connection", (socket: Socket) => {
	try {
		socket.on("joinApp", async (id: string) => {
			socket.join(id);

			//sending online status to every group
			const user = await setOnline(id, true);
			user?.chats.forEach((chat) => {
				io.to(chat.toString()).emit('receiveOnline', {userID: user._id, isOnline: true});
			});
		});

		socket.on("leaveApp", async (id: string) => {
			socket.leave(id);

			//sending online status to every group
			const user = await setOnline(id, false);
			user?.chats.forEach((chat) => {
				io.to(chat.toString()).emit('receiveOnline', {userID: user._id, isOnline: false});
			});
		});

		socket.on('joinChat', (id: string) => {
			socket.join(id);
		});

		socket.on('leaveChat', async (id: string) => {
			socket.leave(id);
		});
		
		//send message
		socket.on('sendMessage', (data: {chatID: string, message: any}) => {
			io.to(data.chatID).emit('receiveMessage', data.message);
			const saveMessage: Message = {
				sender: data.message.sender._id,
				message: data.message.message,
				timestamp: data.message.timestamp,
				messageType: data.message.messageType,
			}
			saveUserMessage(data.chatID, saveMessage);
		});

		//unsend message
		socket.on('sendUnsend', async (data: {chatID: string, timestamp: Date, userID: string}) => {
			io.to(data.chatID).emit('receiveUnsend', {userID: data.userID, timestamp: data.timestamp});
			deleteMessage(data.chatID, data.timestamp, data.userID);
		})

		//send typing status
		socket.on('sendTyping', (data: {chatID: string, username: string, isTyping: boolean}) => {
			io.to(data.chatID).emit('receiveTyping', {username: data.username, isTyping: data.isTyping});
		});

	} catch(error) {
		console.error(error);
	}
});

//mongoDB and server connection
mongoConnect(MONGO_URI!)
.then(() => {
    console.log("connected to database");
    server.listen(typeof PORT === "number" ? PORT : 8080, HOST ?? '0.0.0.0', () => {
        console.log(`Server listening at http://${HOST}:${PORT}`);
    });
}).catch((error) => {
    console.log("failed connecting to database\n", error);
});