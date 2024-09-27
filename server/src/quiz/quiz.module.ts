import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { QuizSocket } from './quiz.socket';

@Module({
    imports: [],
    providers: [QuizSocket, QuizService],
    controllers: [QuizController],
    exports: [],
})
export class QuizModule {}
