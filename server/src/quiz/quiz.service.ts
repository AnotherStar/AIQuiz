import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';
import OpenAI from 'openai';
import axios from 'axios';

const client = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

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
    index: number;
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
        quiz.getQuestionsFromText(false);
        quiz.generateMedia();
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
        }" по 5-бальной шкале от очень простых(1) до супер-профессиональных (5).
Всего нужно вопросов ${this.questionsCount}: 1 правильный и ${this.answersCount + 2} неправильных
Мне нужен ответ в формате JSON, без каких-либо лишних слов.
Постарайся сделать так чтобы вопрос не содержал в себе те же слова что и вариант ответов. 
Вопросы должны быть интересными и разнообразными, не повторяться.
{
  "questions": {
    "message": string; // Сам вопрос
    "rightAnswer": string; // Правильный ответ на вопрос
    "wrongAnswers": string[]; // Варианты неправильного ответа
    "explain": string; // Сообщение о том почему ответ правильный, иногда можешь добавить к сообщению какой-либо интересный факт
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

    async getTitleImage(): Promise<void> {
        const prompt = `Изображение в стиле инфографики, для викторины на тему "${this.theme}". На изображении не должно быть мелких деталей, оно будет небольшим по размеру`;

        const imageUrl = await client.images
            .generate({
                model: 'dall-e-3',
                prompt,
                n: 1,
                size: '1024x1024',
            })
            .then(response => response.data[0].url);

        if (!imageUrl) return;

        const response = await axios.get(imageUrl, {
            responseType: 'stream',
        });

        const writer = fs.createWriteStream(`temp/${this.id}.png`);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    }

    async generateMedia(): Promise<void> {
        fs.mkdirSync(`temp/${this.id}`, { recursive: true });

        await client.audio.speech
            .create({
                model: 'tts-1-hd',
                input: `Квиз на тему: "${this.theme.toUpperCase()}"`,
                voice: 'echo',
            })
            .then(async mp3 => {
                const buffer = Buffer.from(await mp3.arrayBuffer());
                await fs.promises.writeFile(`temp/${this.id}/theme.mp3`, buffer);
            });

        let i = 0;
        for await (const question of this.questions) {
            console.log(question);
            i++;
            await client.audio.speech
                .create({
                    model: 'tts-1-hd',
                    input: question.message,
                    voice: 'echo',
                })
                .then(async mp3 => {
                    const buffer = Buffer.from(await mp3.arrayBuffer());
                    await fs.promises.writeFile(`temp/${this.id}/question-${i}.mp3`, buffer);
                });

            await client.audio.speech
                .create({
                    model: 'tts-1-hd',
                    input: question.explain,
                    voice: 'echo',
                })
                .then(async mp3 => {
                    const buffer = Buffer.from(await mp3.arrayBuffer());
                    await fs.promises.writeFile(`temp/${this.id}/explain-${i}.mp3`, buffer);
                });
        }
    }

    getQuestionsFromText(isShuffle: boolean): void {
        try {
            if (/```json/.test(this.generation.text)) {
                this.generation.text = this.generation.text
                    .replace(/```json/, '')
                    .replace(/```/, '');
            }

            this.questions = JSON.parse(this.generation.text).questions;
            this.questions.forEach((question, index) => {
                const wrongAnswers = [...question.wrongAnswers];
                if (isShuffle) shuffleArray(wrongAnswers);
                question.answers = [question.rightAnswer, ...wrongAnswers].slice(
                    0,
                    this.answersCount,
                );
                if (isShuffle) shuffleArray(question.answers);
                question.rightAnswerIndex = question.answers.indexOf(question.rightAnswer);
                question.index = index + 1;
            });
            if (isShuffle) shuffleArray(this.questions);
        } catch (error) {
            this.questions = [];
            throw new Error('Ошибка парсера');
        }
    }
}

@Injectable()
export class QuizService implements OnApplicationBootstrap {
    quizzes: Quiz[] = [];

    async onApplicationBootstrap() {}

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

    async getList() {
        const filenames = fs.readdirSync('./temp');
        const result: { id: string; theme: string }[] = [];

        filenames.forEach(filename => {
            try {
                const content = fs.readFileSync(`./temp/${filename}`, 'utf-8');
                const quiz = JSON.parse(content);
                result.push({
                    id: quiz.id,
                    theme: quiz.theme,
                });
            } catch (error) {
                console.error(error);
            }
        });
        return result;
    }

    async getItem(id: string, isShuffle: boolean) {
        const quiz = await Quiz.load(id);
        quiz.getQuestionsFromText(isShuffle);
        return quiz;
    }

    async getMedia(id: string) {
        const fileNames = await fs.readdirSync(`./temp/${id}`);
        const media: { base64: string | string[]; name: string; type: string }[] = [];

        fileNames.forEach(fileName => {
            const file = fs.readFileSync(`./temp/${id}/${fileName}`, 'base64');
            const [name, type] = fileName.split('.');
            media.push({ base64: file, name, type });
        });

        const folderNames = ['correct', 'incorrect'];

        for (const folderName of folderNames) {
            const folderMedia = {
                base64: [] as string[],
                name: folderName,
                type: 'mp3',
            };

            const mediaFileNames = await fs.readdirSync(`./media/${folderName}`);

            mediaFileNames.forEach(fileName => {
                const file = fs.readFileSync(`./media/${folderName}/${fileName}`, 'base64');
                folderMedia.base64.push(file);
            });

            media.push(folderMedia);
        }

        return media;
    }
}
