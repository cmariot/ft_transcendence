import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: [
      "https://localhost:8080",
      "https://api.intra.42.fr",
      "https://signin.intra.42.fr",
    ],
  });
  await app.listen(process.env.BACKEND_PORT);
}
bootstrap();
