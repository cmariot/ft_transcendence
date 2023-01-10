import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import * as passport from "passport";
import * as session from "express-session";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: "*",
    credentials: true,
  });

  app.use(
    session({
      secret: process.env.SESSION_PASSWORD,
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(process.env.BACKEND_PORT);
}
bootstrap();
