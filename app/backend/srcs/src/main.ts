import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import passport from "passport";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({ origin: "http://localhost:4000", credentials: true });
  app.use(passport.initialize());
  await app.listen(process.env.BACKEND_PORT);
}
bootstrap();
