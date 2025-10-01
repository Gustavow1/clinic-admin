import { Inject, Injectable } from "@nestjs/common";
import { Channel, ConsumeMessage, Message } from "amqplib";
import { RabbitMQProviderType } from "./rabbitmq.provider";
import { rabbitMQConfig } from "src/config/config";
import { ILog } from "src/interfaces/log";

@Injectable()
export class RabbitMQService {
  private channel: Channel;

  constructor(
    @Inject("RABBITMQ_PROVIDER")
    private readonly rabbitMQProvider: RabbitMQProviderType,
  ) {}

  async start() {
    if (!this.channel) this.channel = await this.rabbitMQProvider;
  }

  async publishInQueue(queue: string, message: ILog) {
    await this.channel.assertQueue(rabbitMQConfig.queue, { durable: false })
    this.channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(message)),
    );
    console.log(" [x] Sent '%s'", message);
  }

  async consume(queue: string, callback?: (message: Message) => void) {
    await this.channel.assertQueue(rabbitMQConfig.queue, { durable: false });
    return this.channel.consume(queue, (message: ConsumeMessage) => {
      if (callback) callback(message);
      this.channel.ack(message);
    });
  }
}