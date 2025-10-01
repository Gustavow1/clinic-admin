import { NestFactory } from "@nestjs/core";
import { RabbitMQModule } from "./rabbitmq.module";

async function bootstrap() {
  const app = await NestFactory.create(RabbitMQModule)
  await app.init()
}
bootstrap()