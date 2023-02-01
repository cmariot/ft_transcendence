import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { UserEntity } from "./users/entity/user.entity";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { AppController } from "./app.controller";

@Module({
    imports: [
        AuthModule,
        ConfigModule,
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
            defaults: {
                from: "ft_transcendence <noreply@bot.fr>",
            },
            template: {
                dir: process.cwd() + "/templates/",
                adapter: new HandlebarsAdapter(), // or new PugAdapter()
                options: {
                    strict: true,
                },
            },
        }),
        UsersModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
