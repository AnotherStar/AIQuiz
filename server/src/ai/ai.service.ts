import { Injectable, LoggerService, OnApplicationBootstrap } from '@nestjs/common';
import OpenAI from 'openai';
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';
@Injectable()
export class AiService implements OnApplicationBootstrap {
    constructor() {}

    private client = new OpenAI({
        apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
    });

    async onApplicationBootstrap() {}

    async generateMedia(text: string | string[], name: string): Promise<void> {
        if (Array.isArray(text)) {
            for (const t of text) {
                await this.client.audio.speech
                    .create({
                        model: 'tts-1-hd',
                        input: t,
                        voice: 'echo',
                    })
                    .then(async mp3 => {
                        fs.mkdirSync(`media/${name}`, { recursive: true });
                        const buffer = Buffer.from(await mp3.arrayBuffer());
                        await fs.promises.writeFile(`media/${name}/${uuid()}.mp3`, buffer);
                        console.log(`${name}.mp3 generated`);
                    });
            }
        } else {
            return this.client.audio.speech
                .create({
                    model: 'tts-1-hd',
                    input: text,
                    voice: 'echo',
                })
                .then(async mp3 => {
                    const buffer = Buffer.from(await mp3.arrayBuffer());
                    await fs.promises.writeFile(`media/${name}.mp3`, buffer);
                    console.log(`${name}.mp3 generated`);
                });
        }
    }
}
