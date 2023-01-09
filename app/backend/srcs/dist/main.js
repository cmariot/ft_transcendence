"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
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
//# sourceMappingURL=main.js.map