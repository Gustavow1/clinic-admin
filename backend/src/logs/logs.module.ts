import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { LogRepository } from "src/repositories/log-repository";
import { PrismaLogRepository } from "src/repositories/prisma/prisma-log-repository";
import { LogsController } from "./logs.controller";
import { AuthMiddleware } from "src/middlewares/auth.middleware";

@Module({
  controllers: [LogsController],
  providers: [
    PrismaService,
    {
      provide: LogRepository,
      useClass: PrismaLogRepository,
    },
  ],
})
export class LogsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: "/logs",
      method: RequestMethod.GET
    })
  }
}
