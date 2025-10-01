import { Module } from "@nestjs/common";
import { RabbitMQProvider } from "./rabbitmq.provider";
import { LogService } from "./log.service";
import { RabbitMQService } from "./rabbitmq.service";
import { PrismaService } from "src/database/prisma.service";
import { LogRepository } from "src/repositories/log-repository";
import { PrismaLogRepository } from "src/repositories/prisma/prisma-log-repository";

@Module({
  providers: [RabbitMQModule, RabbitMQProvider, LogService, RabbitMQService, PrismaService, {
    provide: LogRepository,
    useClass: PrismaLogRepository,
  }],
  exports: [RabbitMQModule, RabbitMQProvider, RabbitMQService],
})
export class RabbitMQModule {}