import { ConfigService } from "@nestjs/config";
import { Channel, connect, Connection } from "amqplib";

let connection: Connection
let channel: Channel
export const RabbitMQProvider = {
  provide: "RABBITMQ_PROVIDER",
  useFactory: async (configService: ConfigService) => {
    const uri = configService.get("RABBITMQ_URI");
    connection = await connect(uri);
    channel = await connection.createChannel();

    return channel;
  },
  inject: [ConfigService],
};

export const closeConnection = async () => {
  if (connection) {
    setTimeout(async () => {
      await connection.close()
    }, 500);
  }
}

export type RabbitMQProviderType = Promise<Channel>;
