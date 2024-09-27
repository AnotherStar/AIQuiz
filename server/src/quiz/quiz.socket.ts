import { Injectable } from '@nestjs/common';
import { createServer } from 'http';
import { Server } from 'socket.io';
import {
    ClientToServerEvents,
    InterServerEvents,
    ServerToClientEvents,
    SocketData,
} from '../types';
import { SOCKET_PORT } from '../config';

@Injectable()
export class QuizSocket {
    httpServer = createServer({});
    io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

    constructor() {
        this.httpServer.listen(SOCKET_PORT);

        this.io = new Server(this.httpServer, {});

        this.io.on('connect', socket => {
            this.io.on('connection', socket => {
                socket.join('lobby');
            });

            socket.on('disconnect', () => {});
        });

        setInterval(() => {
            this.io.emit('noArg');
        }, 1000);
    }
}
