import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
    collection: 'User',
})
export class User {
    @Prop({
        type: String,
        required: true,
        min: 3,
        max: 25,
    })
    username: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
