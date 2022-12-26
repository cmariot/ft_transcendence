import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module(
	{
		imports: [

			// Module for the env variables
			ConfigModule.forRoot({isGlobal: true}),

			// Module to connect the backend to postgres database
			TypeOrmModule.forRoot({
				type: 'postgres',
				url: process.env.DATABASE_URL,
				autoLoadEntities: true,
				synchronize: true
			}),

			// User module
			UserModule

		],
		controllers: [AppController],
		providers: [AppService]
	}
)
export class AppModule
{}
