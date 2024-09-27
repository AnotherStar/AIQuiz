import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';

function shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const enum OpenAiModel {
    'chatgpt-4o-latest' = 'chatgpt-4o-latest',
}

export interface Question {
    message: string;
    rightAnswer: string;
    wrongAnswers: string[];
    rightIndex: number;
    explain: string;
    answer: number;
    answers: string[];
    rightAnswerIndex: number;
}

export class Quiz {
    id = uuid();
    theme: string;
    age: number;
    difficulty: number;
    questions: Question[];
    questionsCount: number = 10;
    answersCount: number = 4;

    constructor(data: Pick<Quiz, 'theme' | 'age' | 'difficulty'>) {
        Object.assign(this, data);
    }

    static async create(
        data: Pick<Quiz, 'theme' | 'age' | 'difficulty' | 'questionsCount'>,
    ): Promise<Quiz> {
        const quiz = new Quiz(data);
        console.log(1);
        console.time('getQuestionsText');
        await quiz.getQuestionsText();
        console.log(2);
        await quiz.save();
        console.timeEnd('getQuestionsText');
        quiz.getQuestionsFromText();
        return quiz;
    }

    static async load(id: string): Promise<Quiz> {
        await 1;
        const dataString = fs.readFileSync(`./temp/${id}.json`, 'utf-8');
        const data = JSON.parse(dataString);
        const quiz = new Quiz(data);
        return quiz;
    }

    async save(): Promise<void> {
        await 1;
        fs.writeFileSync(`./temp/${this.id}.json`, JSON.stringify(this, null, 2));
    }

    get prompt() {
        return `
Придумай квиз на тему "${this.theme}".
Мой возраст "${this.age} лет".
Сложность вопросов "${
            this.difficulty
        }" по 5-бальной шкале от элементарных (1) до профессиональных (5).
Всего нужно вопросов ${this.questionsCount}: 1 правильный и ${this.answersCount + 2} неправильных
Мне нужен ответ в формате JSON, без каких-либо лишних слов.
{
  "questions": {
    "message": string; // Сам вопрос
    "rightAnswer": string; // Правильный ответ на вопрос
    "wrongAnswers": string[]; // Варианты неправильного ответа
    "explain": string; // Сообщение о том почему ответ правильный
  }
}
`;
    }

    generation: {
        prompt: string;
        model: string;
        text: string;
        time: number;
    };

    async getQuestionsText(): Promise<void> {
        const startTime = Date.now();

        const model = OpenAiModel['chatgpt-4o-latest'];

        const { text } = await generateText({
            model: openai(model),
            system: 'You are a friendly assistant!',
            prompt: this.prompt,
        });

        this.generation = {
            prompt: this.prompt,
            model,
            text,
            time: Date.now() - startTime,
        };
    }

    getQuestionsFromText(): void {
        try {
            this.questions = JSON.parse(this.generation.text).questions;
            this.questions.forEach(question => {
                const wrongAnswers = [...question.wrongAnswers];
                shuffleArray(wrongAnswers);
                question.answers = [question.rightAnswer, ...wrongAnswers].slice(
                    0,
                    this.answersCount,
                );
                shuffleArray(question.answers);
                question.rightAnswerIndex = question.answers.indexOf(question.rightAnswer);
            });
            shuffleArray(this.questions);
        } catch (error) {
            this.questions = [];
            throw new Error('Ошибка парсера');
        }
    }
}

@Injectable()
export class QuizService implements OnApplicationBootstrap {
    quizes: Quiz[] = [];

    async generate(
        theme: string,
        age: number,
        difficulty: number,
        questionsCount: number,
    ): Promise<Quiz> {
        console.log('generate');

        const quiz = await await Quiz.create({
            theme,
            difficulty,
            age,
            questionsCount,
        });

        return quiz;
    }

    async onApplicationBootstrap() {}

    async getList() {
        const filenames = fs.readdirSync('./temp');
        return filenames.map(filename => {
            const content = fs.readFileSync(`./temp/${filename}`, 'utf-8');
            const quiz = JSON.parse(content);
            return {
                id: quiz.id,
                theme: quiz.theme,
            };
        });
    }

    async getItem(id: string) {
        const quiz = await Quiz.load(id);
        quiz.getQuestionsFromText();
        return quiz;
    }
}
