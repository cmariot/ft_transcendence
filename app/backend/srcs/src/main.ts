import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { json } from "express";
require("events").EventEmitter.prototype._maxListeners = 100;

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());
    app.use(json({ limit: "1mb" }));
    app.enableCors({
        origin: process.env.HOST,
        credentials: true,
    });
    await app.listen(process.env.BACKEND_PORT || 3000);
}
bootstrap();
