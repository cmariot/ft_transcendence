"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const passport = require("passport");
const session = require("express-session");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: "*",
        credentials: true,
    });
    app.use(session({
        secret: process.env.SESSION_PASSWORD,
        resave: false,
        saveUninitialized: false,
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    await app.listen(process.env.BACKEND_PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map