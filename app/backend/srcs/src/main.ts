import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as session from "express-session";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(
    session({
      secret: process.env.SESSION_PASSWORD,
      resave: false,
      saveUninitialized: false,
    })
  );
  app.enableCors({ origin: "http://localhost:4000", credentials: true });
  await app.listen(process.env.BACKEND_PORT);
}
bootstrap();
