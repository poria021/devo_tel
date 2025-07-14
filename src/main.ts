import { Transform } from "class-transformer";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { log } from "console";
import { RmqOptions } from "./interface/Rabbitmq";
import { EmojiLogger } from "./log/logger";
import { HttpExceptionFilter } from "./exception/exception";
require("dotenv").config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: new EmojiLogger(),//
  });
  (app as any).set("etag", false);
  app.use((req, res, next) => {
    res.removeHeader("x-powered-by");
    res.removeHeader("date");
    next();
  });
  const config = app.get(ConfigService);
  await app.startAllMicroservices();
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(config.get("port_SERVER"));
}
bootstrap();
