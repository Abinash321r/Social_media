import express from "express";
import cors from'cors';
import cookieParser from "cookie-parser";
import routes from './Routes/routes.js';
import 'dotenv/config';
import connectDB from "./config/db.js";
import { Server } from "socket.io";
import socketHandler from "./socket/socket.js";
import http from "http";

const app = express();// create  server
app.use(express.static('public'));
app.use(cors({origin: `${process.env.CLIENT_URL}`,credentials:true}));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use('/',routes);

connectDB(); // database connection

const server = http.createServer(app); // create socket server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});
socketHandler(io);

// start socket server
server.listen(process.env.SOCKET_SERVER_PORT, () => {
  console.log(`WebSocketServer started at port ${process.env.SOCKET_SERVER_PORT}`);
});
