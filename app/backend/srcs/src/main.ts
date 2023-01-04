import { NestFactory }		from '@nestjs/core';
import { ValidationPipe }	from '@nestjs/common';
import { AppModule }		from './app.module';

async function bootstrap()
{
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	app.enableCors(
		{
			"origin": "http://frontend",
			"methods": "GET,POST,DELETE"
		}
	);
	await app.listen(process.env.BACKEND_PORT);
}

bootstrap();
