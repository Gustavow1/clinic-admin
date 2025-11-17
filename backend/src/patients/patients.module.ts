import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { PatientsController } from "./patients.controller";
import { PatientRepository } from "src/repositories/patient-repository";
import { PrismaService } from "src/database/prisma.service";
import { PrismaPatientRepository } from "src/repositories/prisma/prisma-patient-repository";
import { LoggerMiddleware } from "src/middlewares/logger.middleware";
import { RabbitMQModule } from "src/services/rabbitmq/rabbitmq.module";
import { RabbitMQProvider } from "src/services/rabbitmq/rabbitmq.provider";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { AuthMiddleware } from "src/middlewares/auth.middleware";

@Module({
  controllers: [PatientsController],
  imports: [
    RabbitMQModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 50,
        },
      ],
    }),
  ],
  providers: [
    PrismaService,
    {
      provide: PatientRepository,
      useClass: PrismaPatientRepository,
    },
    RabbitMQProvider,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class PatientsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: "/patient",
      method: RequestMethod.ALL,
    });
    consumer.apply(AuthMiddleware).forRoutes(PatientsController)
  }
}