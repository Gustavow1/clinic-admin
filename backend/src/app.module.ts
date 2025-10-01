import { Module } from "@nestjs/common";
import { PatientsModule } from "./patients/patients.module";
import { ConfigModule } from "@nestjs/config";
import { LogsModule } from "./logs/logs.module";
import { EmployeesModule } from "./employees/employee.module";
import { AuthModule } from "./authentication/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PatientsModule,
    LogsModule,
    EmployeesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
