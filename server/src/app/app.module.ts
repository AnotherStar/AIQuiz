import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizModule } from '@server/quiz/quiz.module';
import { UserModule } from '@server/user/user.module';
import { MONGO_URL } from '../config';
@Module({
    imports: [MongooseModule.forRoot(MONGO_URL), QuizModule, UserModule],
    controllers: [],
    providers: [],
    exports: [],
})
export class AppModule {}
