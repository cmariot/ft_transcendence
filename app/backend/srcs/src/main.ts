import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());
    app.use(helmet());
    app.enableCors({
        origin: process.env.HOST,
        credentials: true,
    });
    await app.listen(process.env.BACKEND_PORT);
}
bootstrap();
