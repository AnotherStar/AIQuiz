import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { QuizService } from './quiz.service';

@Controller('/quiz')
export class QuizController {
    constructor(private quizService: QuizService) {}

    @Get('/')
    getList() {
        return this.quizService.getList();
    }

    @Get('/:id')
    getItem(@Param('id') id: string) {
        return this.quizService.getItem(id);
    }

    @Post('/generate')
    generate(
        @Body('theme') theme: string,
        @Body('age') age: number,
        @Body('difficulty') difficulty: number,
        @Body('questionsCount') questionsCount: number,
    ) {
        return this.quizService.generate(theme, age, difficulty, questionsCount);
    }
}
