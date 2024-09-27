import axios from 'axios';
import { QuizController } from '@server/quiz/quiz.controller';
import { Quiz } from '@server/quiz/quiz.service';
import { io, Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from '@server/types';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

const instance = axios.create({
    baseURL: '/api',
});

const getItem = (id: string) => {
    return instance
        .get<ReturnType<QuizController['getItem']>>(`/quiz/${id}`)
        .then(response => response.data);
};

const getList = () => {
    return instance
        .get<ReturnType<QuizController['getList']>>(`/quiz`)
        .then(response => response.data);
};

const generate = (
    theme: string,
    age: number,
    difficulty: number,
    questionsCount: number,
): Promise<Quiz> => {
    return instance
        .post<ReturnType<QuizController['generate']>>(`/quiz/generate`, {
            theme,
            age,
            difficulty,
            questionsCount,
        })
        .then(response => response.data);
};

const Api = {
    Quiz: {
        getItem,
        getList,
        generate,
    },
};

export default () => ({
    Api,
});
