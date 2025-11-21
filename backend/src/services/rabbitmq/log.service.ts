import { Injectable, OnModuleInit } from "@nestjs/common";
import { RabbitMQService } from "./rabbitmq.service";
import { rabbitMQConfig } from "src/config/config";
import { LogRepository } from "src/repositories/log-repository";

@Injectable()
export class LogService implements OnModuleInit {
  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly logRepository: LogRepository
  ) { }

  async onModuleInit() {
    await this.rabbitMQService.start();
    await this.rabbitMQService.consume(
      rabbitMQConfig.queue,
      async (message) => {
        const log = JSON.parse(message.content.toString());

        await this.logRepository.create(log);
      },
    );
  }

  async onModuleDestroy() {
    await this.rabbitMQService.consume(
      rabbitMQConfig.queue,
      async (message) => {
        const log = JSON.parse(message.content.toString());

        await this.logRepository.create(log);
      },
    );
  }
}
