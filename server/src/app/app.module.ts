import { AiModule } from '@server/ai/ai.module';
import { Module } from '@nestjs/common';
import { MONGO_URL } from '../config';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizModule } from '@server/quiz/quiz.module';
import { UserModule } from '@server/user/user.module';

@Module({
    imports: [MongooseModule.forRoot(MONGO_URL), QuizModule, UserModule, AiModule],
    controllers: [],
    providers: [],
    exports: [],
})
export class AppModule {}
