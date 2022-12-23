import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const cors = require('cors');
	app.use(cors());
	await app.listen(4000);
}
bootstrap();
