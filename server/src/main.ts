import { SERVER_PORT } from './config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log'],
    });

    app.enableCors();

    app.setGlobalPrefix('api');

    await app.listen(SERVER_PORT);
}

bootstrap();
