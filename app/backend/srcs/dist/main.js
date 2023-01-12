"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const session = require("express-session");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(session({
        secret: process.env.SESSION_PASSWORD,
        resave: false,
        saveUninitialized: false,
    }));
    app.enableCors({ origin: "http://localhost:4000", credentials: true });
    await app.listen(process.env.BACKEND_PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map