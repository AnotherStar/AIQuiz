import { config } from 'dotenv';

config({
    path: './.env',
});

export const SERVER_PORT = parseInt(process.env.SERVER_PORT || '');
export const SOCKET_PORT = parseInt(process.env.SOCKET_PORT || '');
export const MONGO_URL = process.env.MONGO_URL || '';
