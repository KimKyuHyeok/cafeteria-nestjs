import { Socket } from "socket.io";

export interface CustomSocket extends Socket {
    user?: any;
    company?: any;
}



