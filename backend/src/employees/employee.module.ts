import { Module } from "@nestjs/common";
import { EmployeesController } from "./employee.controller";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";

@Module({
  controllers: [EmployeesController],
  imports: [ThrottlerModule.forRoot({
    throttlers: [
      {
        ttl: 300000,
        limit: 10
      }
    ]
  })],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class EmployeesModule {}
