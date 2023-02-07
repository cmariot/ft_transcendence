import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { UserEntity } from "./users/entity/user.entity";
import { MailerModule } from "@nestjs-modules/mailer";
import { AppController } from "./app.controller";
import { ChatModule } from "./chat/chat.module";

@Module({
    imports: [
        AuthModule,
        ChatModule,
        ConfigModule,
        MailerModule.forRoot({
            transport: {
                host: process.env.EMAIL_HOST,
                port: parseInt(process.env.EMAIL_PORT),
                secure: true,
                auth: {
                    user: process.env.EMAIL_ADDR,
                    pass: process.env.EMAIL_PASS,
                },
            },
        }),
        TypeOrmModule.forRoot({
            type: "postgres",
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_SCHEMA,
            entities: [UserEntity],
            synchronize: true,
        }),
        UsersModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
