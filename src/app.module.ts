import { Module, ValidationPipe, MiddlewareConsumer } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
const redisStore = require("cache-manager-redis-store");
import type { RedisClientOptions } from "redis";
import { CacheModule } from "@nestjs/cache-manager";
import typeorm from "./config/typeorm";
import { HttpModule } from "@nestjs/axios";
import { DevotelModule } from "./devotel/devotel.module";
import { ScheduleModule } from "@nestjs/schedule";
import { BullModule } from "@nestjs/bullmq";
import { JobEntity } from "./devotel/Entity/Job.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [typeorm],
    }),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        connection: {
          host: config.get("QUEUE_HOST"),
          port: config.get("QUEUE_PORT"),
          password: config.get("QUEUE_PASSWORD"),
        },
      }),
    }),
    ScheduleModule.forRoot(),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (config: ConfigService) => ({
        store: redisStore,
        // url: process.env.REDIS_URL,
        host: config.get("REDIS_HOST"),
        port: config.get("REDIS_PORT"),
        password: config.get("REDIS_PASSWORD"),
        // tls: config.get('REDIS_TLS'),
      }),
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: config.get("host_postgres"),
        port: config.get("port_postgres"),
        username: config.get("user_postgres"),
        password: config.get("password_postgres"),
        database: config.get("database_postgres"),
        entities: [JobEntity],
        // synchronize: true,
        // logging: true,
      }),
      inject: [ConfigService],
    }),
    DevotelModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
