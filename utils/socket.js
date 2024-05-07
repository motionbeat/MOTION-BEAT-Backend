import { Server } from "socket.io";
import { createServer } from "http";
import {app} from "../app.js"

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PATCH"], // Specify the allowed HTTP methods
        allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"], // Specify the allowed headers
        credentials: true
    }
});

export {io, httpServer};