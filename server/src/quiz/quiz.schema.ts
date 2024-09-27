import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuizDocument = Quiz & Document;

@Schema({
    collection: 'Quiz',
})
export class Quiz {
    @Prop({
        type: String,
        required: true,
        min: 5,
        max: 25,
    })
    theme: string;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
